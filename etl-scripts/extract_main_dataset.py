import pandas as pd
import plotly.express as px
import json
from pathlib import Path

if __name__ == "__main__":
    # Load data
    df = pd.read_csv(
        "data/data.csv"
    )  # https://discord.com/channels/@me/973985048393031740/978745424166912091
    df_infl = pd.read_csv(
        "data/inflation.csv"
    )  # https://www150.statcan.gc.ca/n1/pub/71-607-x/2018016/cpilg-ipcgl-eng.htm

    # Preprocessing
    df_infl.loc[:, "date"] = pd.to_datetime(df_infl.loc[:, "date"])
    date_infl = df_infl["date"].unique()
    df = df.drop(
        columns=[
            "GEO",
            "DGUID",
            "UOM_ID",
            "STATUS",
            "SYMBOL",
            "TERMINATED",
            "SCALAR_FACTOR",
            "SCALAR_ID",
            "VECTOR",
            "COORDINATE",
        ]
    )
    df.columns = ["date", "product", "unit", "value", "decimals"]
    print(len(df["product"].unique()))
    # indexes_cents = df["unit"] != "Dollars"
    # df.loc[indexes_cents,"value"] = df.loc[indexes_cents,"value"]/100
    # df.loc[indexes_cents,"unit"] = "Dollars"
    df = df[df["unit"] == "Dollars"]
    df.loc[:, "date"] = pd.to_datetime(df.loc[:, "date"])
    df = df[df["date"].isin(date_infl)]
    px.box(df_infl, x="consumer price index", orientation="h").show()
    print("----------------------------------------------------")
    print(df_infl.describe())
    print("----------------------------------------------------")
    # Merge data with inflation data
    df = pd.merge(df, df_infl, on="date")

    # Normalize data by inflation
    df.loc[:, "value_norm"] = df.loc[:, "value"] / df.loc[:, "consumer price index"]
    df.to_csv("data/data_norm.csv")
    df_infl = df[["date","consumer price index"]].drop_duplicates()
    df_infl.sort_values(["date"], inplace=True)
    df_infl.to_csv("data/inflation_preprocessed.csv")
    fig = px.box(
        df,
        x="product",
        y="value",
        labels={"value": "Value ($)", "product": "Product"},
        log_y=True,
    )
    fig.show()

    # Load categories
    with open(str(Path(__file__).parent / "data/categories.json"), "r") as f:
        categories = json.load(f)

    # Filter by categories
    # category = "vegetables"
    # df = df[df["product"].isin(categories[category])]

    # Plot
    fig = px.line(
        df,
        x="date",
        y="value_norm",
        color="product",
        title="Product values normalized by consumer price index",
    )
    fig.write_html("data/plot1.html")
    fig.show()

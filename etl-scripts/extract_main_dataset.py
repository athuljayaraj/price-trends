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
    df = df[df["unit"] == "Dollars"]
    df.loc[:, "date"] = pd.to_datetime(df.loc[:, "date"])
    df = df[df["date"].isin(date_infl)]
    px.box(df_infl, x="consumer price index", orientation="h").show()
    # Merge data with inflation data
    df = pd.merge(df, df_infl, on="date")

    # Normalize data by inflation
    df.loc[:, "value_norm"] = df.loc[:, "value"] / df.loc[:, "consumer price index"]
    df.to_csv("data/data_norm.csv")
    df_infl = df[["date","consumer price index"]].drop_duplicates()
    df_infl.sort_values(["date"], inplace=True)
    df_infl.to_csv("data/inflation_preprocessed.csv")

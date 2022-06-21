import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

if __name__ == "__main__":
    df = pd.read_csv("src/assets/data/data_norm.csv",index_col=0)
    df = df.query('unit=="Dollars"')
    df = df[['date','product','value']]
    for prod in df["product"].unique():
        new_df = df.query(f"product=='{prod}'").copy()
        new_df.loc[:,"year"] = new_df.loc[:,"date"].str.slice(start=0,stop=4)
        new_df.loc[:,"date"] = new_df.loc[:,"date"].str.slice(start=5,stop=7)
        px.line(new_df,x="date",y="value",color="year",title=prod).show()
    
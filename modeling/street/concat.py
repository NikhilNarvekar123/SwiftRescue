import pandas as pd

df1 = pd.read_csv("test1.csv")
dfm = pd.read_csv("missing.csv")
df2 = pd.read_csv("test2.csv")
df3 = pd.read_csv("test3.csv")
df4 = pd.read_csv("test4.csv")
df5 = pd.read_csv("test5.csv")
df6 = pd.read_csv("test6.csv")
df8 = pd.read_csv("test7.csv")
df7 = pd.read_csv("test.csv")

frames = [df1, dfm, df2, df3, df4, df5, df6, df8, df7]
res = pd.concat(frames)
print(res)
print(len(res))
res.to_csv("concat.csv")
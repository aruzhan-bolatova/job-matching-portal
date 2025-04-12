import streamlit as st
import pandas as pd
import plotly.express as px

# Load CSV
df = pd.read_csv("job_data.csv")
print(df.head())  # Debugging line to check the data

# Clean and preprocess
df['applicants_num'] = df['applicants_num'].str.extract(r'(\d+)').astype(float)  # convert '116 applicants' to 116 if needed

# Streamlit App
st.title("📊 Early Career Job Market Insights Dashboard")

# KPI Metrics
st.subheader("📈 Key Metrics")
col1, col2, col3 = st.columns(3)
col1.metric("Total Jobs", len(df))
col2.metric("Unique Companies", df['company_name'].nunique())
avg_applicants = df['applicants_num'].mean() if df['applicants_num'].notnull().any() else 0
col3.metric("Avg Applicants", f"{avg_applicants:.1f}")

st.markdown("---")

# Jobs by Seniority Level
st.subheader("🧭 Jobs by Seniority Level")
seniority_counts = df['seniority_level'].value_counts()
fig_seniority = px.bar(seniority_counts, x=seniority_counts.index, y=seniority_counts.values, labels={'x': 'Seniority Level', 'y': 'Number of Jobs'})
st.plotly_chart(fig_seniority)

# Jobs by Employment Type
st.subheader("💼 Jobs by Employment Type")
employment_counts = df['employment_type'].value_counts()
fig_employment = px.bar(employment_counts, x=employment_counts.index, y=employment_counts.values, labels={'x': 'Employment Type', 'y': 'Number of Jobs'})
st.plotly_chart(fig_employment)

# Jobs by Job Function
st.subheader("🛠️ Jobs by Function")
function_counts = df['job_function'].value_counts()
fig_function = px.bar(function_counts, x=function_counts.index, y=function_counts.values, labels={'x': 'Job Function', 'y': 'Number of Jobs'})
st.plotly_chart(fig_function)

# Jobs by Industry
st.subheader("🏭 Jobs by Industry")
industry_counts = df['industry'].value_counts()
fig_industry = px.bar(industry_counts, x=industry_counts.index, y=industry_counts.values, labels={'x': 'Industry', 'y': 'Number of Jobs'})
st.plotly_chart(fig_industry)

# Top Hiring Companies
st.subheader("🏢 Top Hiring Companies")
top_companies = df['company_name'].value_counts().head(10)
fig_companies = px.bar(top_companies, x=top_companies.index, y=top_companies.values)
st.plotly_chart(fig_companies)

# Jobs by Location
st.subheader("🌍 Job Count by Location")
top_locations = df['location'].value_counts().head(10)
fig_locations = px.bar(top_locations, x=top_locations.index, y=top_locations.values)
st.plotly_chart(fig_locations)

# Raw Data Table
st.subheader("📄 Job Listings Data")
st.dataframe(df)

# Download button
csv = df.to_csv(index=False)
st.download_button("⬇️ Download CSV", data=csv, file_name='job_market_insights.csv', mime='text/csv')
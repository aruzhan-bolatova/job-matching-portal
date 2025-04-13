import streamlit as st
import pandas as pd

# Load your job data CSV
df = pd.read_csv("job_data.csv")

# Optional: convert applicants number to numeric if needed
df['applicants_num'] = df['applicants_num'].astype(str).str.extract(r'(\d+)')
df['applicants_num'] = pd.to_numeric(df['applicants_num'], errors='coerce')

# App title
st.title("💬 AI Job Recommendation Chatbot")

# Intro message
st.write("Hi there! I'm your AI-powered job assistant. Tell me a bit about yourself, and I'll suggest some jobs for you.")

# Step 1: Get skills
skills_input = st.text_input("📝 What skills do you have? (comma-separated, e.g. Python, React)")

# Step 2: Preferred location
location_input = st.text_input("🌍 Where would you like to work? (optional)")

# Step 3: Preferred job function
job_function_input = st.text_input("💼 What job function interests you? (optional)")

# When user clicks the button
if st.button("🔍 Find Jobs"):
    results = df.copy()

    # Filter by skills in job title or job function
    if skills_input:
        keywords = [kw.strip().lower() for kw in skills_input.split(",")]
        results = results[
            results['job_title'].str.lower().apply(lambda title: any(kw in title for kw in keywords)) |
            results['job_function'].str.lower().apply(lambda func: any(kw in func for kw in keywords))
        ]

    # Filter by location
    if location_input:
        results = results[results['location'].str.lower().str.contains(location_input.lower())]

    # Filter by job function
    if job_function_input:
        results = results[results['job_function'].str.lower().str.contains(job_function_input.lower())]

    st.markdown("---")

    if results.empty:
        st.warning("Sorry — no matching jobs found. Try adjusting your preferences.")
    else:
        st.subheader(f"🎯 {len(results)} Matching Jobs Found")
        st.dataframe(results[['job_title', 'company_name', 'location', 'seniority_level', 'employment_type', 'job_function', 'industry', 'posted', 'applicants_num']].head(10))

# Footer
st.markdown("---")
st.write("🚀 Powered by your scraped job market data 📊")
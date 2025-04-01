'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateJob, getJobById, type Job } from "@/app/api-service"

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        console.log(id);
        const response = await getJobById(id);
        console.log("Response: ", response);
        if (!response) throw new Error('Failed to fetch job');
        setJob(response);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (job) {
        const response = await updateJob(id, job);
        console.log(response);
        if (!response) throw new Error('Failed to update job');
        router.push('/jobs');
      } else {
        throw new Error('Job data is missing');
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 py-20 shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleUpdate}>
        <label className="block mb-2">
          Title:
          <input
            type="text"
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Company:
          <input
            type="text"
            value={job.company}
            onChange={(e) => setJob({ ...job, company: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Description:
          <textarea
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Requirements:
          <textarea
            value={job.requirements}
            onChange={(e) => setJob({ ...job, requirements: e.target.value.split(',').map(req => req.trim()) })}
            className="w-full p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

import QuizPieChart from "@/components/QuizStatsChart";


export default function App() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quiz Performance</h2>
      <QuizPieChart  />
    </div>
  );
}

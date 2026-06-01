import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    } from "chart.js";

    import { getMetricData } from "../services/metricsService";

    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    );

    function Dashboard() {

    const [data, setData] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
        const result = await getMetricData("commits");
        setData(result);
        } catch (error) {
        console.error(error);
        }
    };

    const total = data.reduce(
        (sum, item) => sum + item.value,
        0
    );

    const promedio =
        data.length > 0
        ? (total / data.length).toFixed(1)
        : 0;

    const maximo =
        data.length > 0
        ? Math.max(...data.map(x => x.value))
        : 0;

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [
        {
            label: "Commits",
            data: data.map(item => item.value),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.2)",
            fill: true,
            tension: 0.4
        }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
        legend: {
            position: "top"
        }
        }
    };

    return (
        <div
        style={{
            minHeight: "100vh",
            background: "#f5f7fa",
            padding: "30px"
        }}
        >
        <h1>Dashboard de Métricas</h1>

        <div
            style={{
            display: "grid",
            gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginBottom: "25px"
            }}
        >
            <MetricCard
            title="Total Commits"
            value={total}
            />

            <MetricCard
            title="Promedio Diario"
            value={promedio}
            />

            <MetricCard
            title="Máximo"
            value={maximo}
            />
        </div>

        <div
            style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <h2>Evolución de Commits</h2>

            <Line
            data={chartData}
            options={chartOptions}
            />
        </div>
        </div>
    );
    }

    function MetricCard({ title, value }) {
    return (
        <div
        style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)"
        }}
        >
        <h4
            style={{
            color: "#6b7280",
            marginBottom: "10px"
            }}
        >
            {title}
        </h4>

        <h2>{value}</h2>
        </div>
    );
}

export default Dashboard;
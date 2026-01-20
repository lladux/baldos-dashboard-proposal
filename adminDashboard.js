// =======================================
// ADMIN DASHBOARD – BALDOTS
// ECharts + ECharts GL
// SIN AZUL
// =======================================

// ======================
// DATOS SIMULADOS
// ======================
const adminData = {
    activity_per_day: [
        { day: "L", total: 120 },
        { day: "M", total: 180 },
        { day: "X", total: 160 },
        { day: "J", total: 200 },
        { day: "V", total: 230 },
        { day: "S", total: 260 },
        { day: "D", total: 240 }
    ],

    error_types: [
        { label: "Signos (+/-)", value: 40 },
        { label: "Orden de operaciones", value: 30 },
        { label: "Factorización", value: 20 },
        { label: "Cálculo incorrecto", value: 10 }
    ],

    topic_performance: [
        { topic: "Aritmética", value: 85 },
        { topic: "Álgebra", value: 70 },
        { topic: "Geometría", value: 78 },
        { topic: "Cálculo", value: 62 },
        { topic: "Probabilidad", value: 80 }
    ],

    difficulty_heatmap: [
        [0, 0, 90], [1, 0, 72], [2, 0, 55],
        [0, 1, 10], [1, 1, 28], [2, 1, 45]
    ],

    help_usage: [60, 48, 32, 22],
    retention: [100, 82, 63, 44, 29],

    // ===== DATOS 3D =====
    performance3d: [
        [0, 0, 92], [0, 1, 78], [0, 2, 55],
        [1, 0, 88], [1, 1, 70], [1, 2, 48],
        [2, 0, 90], [2, 1, 75], [2, 2, 60],
        [3, 0, 82], [3, 1, 65], [3, 2, 42],
        [4, 0, 85], [4, 1, 72], [4, 2, 58]
    ]
};

// ======================
// PALETA SIN AZUL
// ======================
const COLORS = {
    green: "#91cc75",
    yellow: "#fac858",
    red: "#ee6666",
    purple: "#9a60b4",
    orange: "#fc8452"
};

// ======================
// CONFIG BASE
// ======================
const BASE_CONFIG = {
    backgroundColor: "transparent",
    textStyle: {
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif"
    },
    grid: {
        left: "4%",
        right: "4%",
        bottom: "4%",
        top: "14%",
        containLabel: true
    }
};

// ======================
// INIT SEGURO
// ======================
function initAdminDashboard() {
    if (typeof echarts === "undefined") {
        setTimeout(initAdminDashboard, 100);
        return;
    }
    renderAdminCharts();
}



function renderAdminCharts() {

    const charts = [];

    // ======================
    // ACTIVIDAD GLOBAL
    // ======================
    const activity = echarts.init(document.getElementById("globalActivity"));
    activity.setOption({
        ...BASE_CONFIG,
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "category",
            data: adminData.activity_per_day.map(d => d.day),
            axisLabel: { color: "#fff" }
        },
        yAxis: {
            type: "value",
            axisLabel: { color: "#fff" }
        },
        series: [{
            type: "line",
            smooth: true,
            symbolSize: 8,
            data: adminData.activity_per_day.map(d => d.total),
            itemStyle: { color: COLORS.orange },
            lineStyle: { width: 3 },
            areaStyle: {
                color: "rgba(252,132,82,0.25)"
            }
        }]
    });
    charts.push(activity);

    // ======================
    // ERRORES COMUNES
    // ======================
    const errors = echarts.init(document.getElementById("commonErrors"));
    errors.setOption({
        ...BASE_CONFIG,
        tooltip: { trigger: "item" },
        legend: {
            bottom: "0%",
            textStyle: { color: "#fff" }
        },
        series: [{
            type: "pie",
            radius: ["45%", "65%"],
            label: {
                show: false 
            },
            data: adminData.error_types.map((e, i) => ({
                name: e.label,
                value: e.value,
                itemStyle: {
                    color: [
                        COLORS.red,
                        COLORS.yellow,
                        COLORS.purple,
                        COLORS.green
                    ][i]
                }
            }))
        }]
    });
    charts.push(errors);

    // ======================
    // RADAR POR TEMA
    // ======================
    const radar = echarts.init(document.getElementById("topicPerformance"));
    radar.setOption({
        ...BASE_CONFIG,
        radar: {
            indicator: adminData.topic_performance.map(t => ({
                name: t.topic,
                max: 100
            })),
            axisName: { color: "#fff" }
        },
        series: [{
            type: "radar",
            areaStyle: { opacity: 0.3 },
            itemStyle: { color: COLORS.green },
            data: [{
                value: adminData.topic_performance.map(t => t.value)
            }]
        }]
    });
    charts.push(radar);


    // ======================
    // USO DE AYUDAS
    // ======================
    const help = echarts.init(document.getElementById("helpUsage"));
    help.setOption({
        ...BASE_CONFIG,
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "category",
            data: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
            axisLabel: { color: "#fff" }
        },
        yAxis: {
            type: "value",
            axisLabel: { color: "#fff" }
        },
        series: [{
            type: "bar",
            data: adminData.help_usage,
            itemStyle: {
                color: COLORS.yellow,
                borderRadius: [6, 6, 0, 0]
            }
        }]
    });
    charts.push(help);

    // ======================
    // RETENCIÓN
    // ======================
    const retention = echarts.init(document.getElementById("retention"));
    retention.setOption({
        ...BASE_CONFIG,
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "category",
            data: ["Día 1", "Día 3", "Día 7", "Día 14", "Día 30"],
            axisLabel: { color: "#fff" }
        },
        yAxis: {
            type: "value",
            axisLabel: { color: "#fff" }
        },
        series: [{
            type: "line",
            smooth: true,
            data: adminData.retention,
            itemStyle: { color: COLORS.purple },
            lineStyle: { width: 3 }
        }]
    });
    charts.push(retention);

    // ======================
    // GRÁFICA 3D
    // ======================
    const chart3D = echarts.init(document.getElementById("performance3D"));
    chart3D.setOption({
        backgroundColor: "transparent",
        tooltip: {
            formatter: p => `
                Tema: ${["Aritmética","Álgebra","Geometría","Cálculo","Probabilidad"][p.value[0]]}<br>
                Dificultad: ${["Fácil","Media","Difícil"][p.value[1]]}<br>
                Acierto: ${p.value[2]}%
            `
        },
        visualMap: {
            max: 100,
            calculable: true,
            textStyle: { color: "#fff" },
            inRange: {
                color: [COLORS.red, COLORS.yellow, COLORS.green]
            }
        },
        xAxis3D: {
            type: "category",
            data: ["Aritmética","Álgebra","Geometría","Cálculo","Probabilidad"],
            axisLabel: { color: "#fff" }
        },
        yAxis3D: {
            type: "category",
            data: ["Fácil","Media","Difícil"],
            axisLabel: { color: "#fff" }
        },
        zAxis3D: {
            type: "value",
            axisLabel: { color: "#fff" }
        },
        grid3D: {
            boxWidth: 120,
            boxDepth: 60,
            light: {
                main: { intensity: 1.2, shadow: true },
                ambient: { intensity: 0.3 }
            },
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 10
            }
        },
        series: [{
            type: "bar3D",
            data: adminData.performance3d,
            shading: "lambert"
        }]
    });
    charts.push(chart3D);

    // ======================
    // RESIZE GLOBAL
    // ======================
    window.addEventListener("resize", () => {
        charts.forEach(c => c.resize());
    });
}

// ======================
// EJECUCIÓN SEGURA
// ======================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdminDashboard);
} else {
    initAdminDashboard();
}

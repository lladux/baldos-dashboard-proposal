// Datos dummy para el dashboard
const dummyData = {
    total_users: 8,
    problems_per_day: [
        { day: "2026-01-12", solved_count: 5 },
        { day: "2026-01-13", solved_count: 12 },
        { day: "2026-01-14", solved_count: 8 },
        { day: "2026-01-15", solved_count: 15 },
        { day: "2026-01-16", solved_count: 20 },
        { day: "2026-01-17", solved_count: 18 },
        { day: "2026-01-18", solved_count: 22 }
    ],
    correct_vs_wrong: [
        { label: "Correctos", total: 75 },
        { label: "Incorrectos", total: 25 }
    ],
    avg_time_per_problem: [
        { problem_id: 1, avg_time: 45.5 },
        { problem_id: 2, avg_time: 62.3 },
        { problem_id: 3, avg_time: 38.7 },
        { problem_id: 4, avg_time: 71.2 },
        { problem_id: 5, avg_time: 55.8 },
        { problem_id: 6, avg_time: 48.9 }
    ],
    user_rank: [
        { display_name: "Ana García", total_solved: 25, correct_rate: 0.85 },
        { display_name: "Carlos Ruiz", total_solved: 22, correct_rate: 0.78 },
        { display_name: "María López", total_solved: 18, correct_rate: 0.82 },
        { display_name: "Juan Pérez", total_solved: 15, correct_rate: 0.73 },
        { display_name: "Luis Martín", total_solved: 12, correct_rate: 0.80 },
        { display_name: "Sofía Torres", total_solved: 10, correct_rate: 0.75 },
        { display_name: "Diego Silva", total_solved: 8, correct_rate: 0.70 },
        { display_name: "Laura Vega", total_solved: 6, correct_rate: 0.68 }
    ],
    user_time_spent: [
        { display_name: "Ana García", total_time_spent: 1250 },
        { display_name: "Carlos Ruiz", total_time_spent: 980 },
        { display_name: "María López", total_time_spent: 1100 },
        { display_name: "Juan Pérez", total_time_spent: 850 },
        { display_name: "Luis Martín", total_time_spent: 720 },
        { display_name: "Sofía Torres", total_time_spent: 560 },
        { display_name: "Diego Silva", total_time_spent: 450 },
        { display_name: "Laura Vega", total_time_spent: 380 }
    ],
    problems_by_difficulty: [
        { day: "Lun", easy: 120, medium: 80, hard: 30 },
        { day: "Mar", easy: 150, medium: 95, hard: 40 },
        { day: "Mié", easy: 180, medium: 110, hard: 55 },
        { day: "Jue", easy: 200, medium: 130, hard: 70 },
        { day: "Vie", easy: 230, medium: 150, hard: 90 }
    ]

};

const chartColors = {
    primary: "#91cc75",
    secondary: "#fac858",
    tertiary: "#ee6666",
    quaternary: "#73c0de"
};

const commonConfig = {
    backgroundColor: "transparent",
    textStyle: { color: "#ffffff", fontFamily: "system-ui, sans-serif" },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "10%", containLabel: true }
};

// Función para abrir modal de usuario
function openUserModal(userData, position) {
    const medals = ['🥇', '🥈', '🥉'];
    const correctRate = Math.round(userData.correct_rate * 100);
    const correct = Math.round(userData.total_solved * userData.correct_rate);
    const wrong = userData.total_solved - correct;

    // Buscar tiempo del usuario
    const timeData = dummyData.user_time_spent.find(u => u.display_name === userData.display_name);
    const totalTime = timeData ? timeData.total_time_spent : 0;
    const avgTime = userData.total_solved > 0 ? Math.round(totalTime / userData.total_solved) : 0;

    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    // Llenar modal
    document.getElementById('modalMedal').textContent = position <= 3 ? medals[position - 1] : '👤';
    document.getElementById('modalName').textContent = userData.display_name;
    document.getElementById('modalPosition').textContent = `Posición #${position}`;
    document.getElementById('modalSolved').textContent = userData.total_solved;
    document.getElementById('modalAccuracy').textContent = correctRate + '%';
    document.getElementById('modalProgressText').textContent = correctRate + '%';
    document.getElementById('modalProgressBar').style.width = correctRate + '%';
    document.getElementById('modalCorrect').textContent = correct;
    document.getElementById('modalWrong').textContent = wrong;
    document.getElementById('modalTime').textContent = `${minutes}m ${seconds}s`;
    document.getElementById('modalAvgTime').textContent = avgTime + 's';

    // Mostrar modal
    document.getElementById('userModal').classList.add('active');
}

// Función para cerrar modal
function closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function initDashboard() {
    if (typeof echarts === "undefined") {
        setTimeout(initDashboard, 100);
        return;
    }

    loadDashboard();
}

function loadDashboard() {
    const data = dummyData;

    // KPIs
    document.getElementById("kpiUsers").innerText = "Usuarios: " + data.total_users;

    const totalSolved = data.correct_vs_wrong.reduce((acc, item) => acc + item.total, 0);
    document.getElementById("kpiSolved").innerText = "Total resueltos: " + totalSolved;

    const correct = data.correct_vs_wrong.find(x => x.label === "Correctos")?.total || 0;
    const accuracy = totalSolved === 0 ? 0 : Math.round((correct / totalSolved) * 100);
    document.getElementById("kpiAccuracy").innerText = `Acierto global: ${accuracy}%`;

    const totalTime = data.user_time_spent.reduce((acc, x) => acc + x.total_time_spent, 0);
    const h = Math.floor(totalTime / 3600);
    const m = Math.floor((totalTime % 3600) / 60);
    const s = totalTime % 60;
    document.getElementById("kpiTime").innerText = `Tiempo total: ${h}h ${m}m ${s}s`;

    // Chart 1: Problemas por día
    const dailyChart = echarts.init(document.getElementById("problemsPerDay"));
    dailyChart.setOption({
        ...commonConfig,
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            textStyle: { color: "#fff" }
        },
        xAxis: {
            type: "category",
            data: data.problems_per_day.map(x => x.day),
            axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.3)" } },
            axisLabel: { color: "#fff" }
        },
        yAxis: {
            type: "value",
            name: "Problemas",
            nameTextStyle: { color: "#fff" },
            axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.3)" } },
            axisLabel: { color: "#fff" },
            splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } }
        },
        series: [{
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: { color: chartColors.primary },
            lineStyle: { width: 3 },
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: "rgba(145, 204, 117, 0.5)" },
                        { offset: 1, color: "rgba(145, 204, 117, 0.05)" }
                    ]
                }
            },
            data: data.problems_per_day.map(x => x.solved_count)
        }]
    });

    // Chart 2: Correctos vs Incorrectos
    const cwChart = echarts.init(document.getElementById("correctVsWrong"));
    cwChart.setOption({
        ...commonConfig,
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            textStyle: { color: "#fff" }
        },
        legend: {
            bottom: "5%",
            textStyle: { color: "#fff", fontSize: 13 }
        },
        series: [{
            type: "pie",
            radius: ["45%", "70%"],
            itemStyle: {
                borderRadius: 8,
                borderColor: "rgba(0, 0, 0, 0.3)",
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: "{b}: {c}",
                color: "#fff",
                fontSize: 13
            },
            data: data.correct_vs_wrong.map(x => ({
                name: x.label,
                value: x.total,
                itemStyle: {
                    color: x.label === "Correctos" ? chartColors.primary : chartColors.tertiary
                }
            }))
        }]
    });
    // Chart 3: Problemas por rango de tiempo
    const groupedTimes = groupProblemsByTimeRange(data.avg_time_per_problem);

    const avgChart = echarts.init(document.getElementById("avgTimePerProblem"));
    avgChart.setOption({
        ...commonConfig,
        tooltip: {
            trigger: "axis",
            formatter: "{b}<br/>Problemas: {c}",
            backgroundColor: "rgba(0,0,0,0.8)",
            borderColor: "rgba(255,255,255,0.2)",
            textStyle: { color: "#fff" }
        },
        xAxis: {
            type: "category",
            data: Object.keys(groupedTimes),
            axisLine: { lineStyle: { color: "rgba(255,255,255,0.3)" } },
            axisLabel: { color: "#fff" }
        },
        yAxis: {
            type: "value",
            name: "Cantidad de problemas",
            nameTextStyle: { color: "#fff" },
            axisLabel: { color: "#fff" },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }
        },
        series: [{
            type: "bar",
            barWidth: "55%",
            itemStyle: {
                color: chartColors.secondary,
                borderRadius: [6, 6, 0, 0]
            },
            data: Object.values(groupedTimes)
        }]
    });

    // Chart 4: Ranking usuarios (ahora una lista estilizada)
    const rankContainer = document.getElementById("userRank");
    rankContainer.innerHTML = ''; // Limpiar contenido previo

    data.user_rank.forEach((user, index) => {
        const position = index + 1;
        const correctRate = Math.round(user.correct_rate * 100);

        // Determinar medalla para top 3
        const medals = ['🥇', '🥈', '🥉'];
        const medal = position <= 3 ? medals[position - 1] : '';

        // Crear clase para top 3
        const topClass = position <= 3 ? `top-${position}` : '';

        const item = document.createElement('div');
        item.className = `ranking-item ${topClass}`;
        item.onclick = () => openUserModal(user, position);
        item.innerHTML = `
            ${medal ? `<div class="ranking-medal">${medal}</div>` : `<div class="ranking-position">${position}</div>`}
            <div class="ranking-info">
                <div class="ranking-name">${user.display_name}</div>
                <div class="ranking-accuracy">Precisión: ${correctRate}%</div>
            </div>
            <div class="ranking-stats">
                <div class="ranking-solved">${user.total_solved}</div>
                <div class="ranking-label">resueltos</div>
            </div>
        `;

        rankContainer.appendChild(item);
    });

    // Chart 5: Tiempo por usuario
    // Chart: Problemas resueltos por dificultad
    const difficultyChart = echarts.init(
        document.getElementById("problemsByDifficulty")
    );

    difficultyChart.setOption({
        ...commonConfig,
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(0,0,0,0.85)",
            borderColor: "rgba(255,255,255,0.2)",
            textStyle: { color: "#fff" }
        },
        legend: {
            top: "5%",
            textStyle: { color: "#fff" }
        },
        xAxis: {
            type: "category",
            data: data.problems_by_difficulty.map(d => d.day),
            axisLine: { lineStyle: { color: "rgba(255,255,255,0.3)" } },
            axisLabel: { color: "#fff" }
        },
        yAxis: {
            type: "value",
            name: "Problemas",
            nameTextStyle: { color: "#fff" },
            axisLabel: { color: "#fff" },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }
        },
        series: [
            {
                name: "Fácil",
                type: "line",
                smooth: true,
                symbol: "circle",
                itemStyle: { color: "#91cc75" },
                data: data.problems_by_difficulty.map(d => d.easy)
            },
            {
                name: "Media",
                type: "line",
                smooth: true,
                symbol: "circle",
                itemStyle: { color: "#fac858" },
                data: data.problems_by_difficulty.map(d => d.medium)
            },
            {
                name: "Difícil",
                type: "line",
                smooth: true,
                symbol: "circle",
                itemStyle: { color: "#ee6666" },
                data: data.problems_by_difficulty.map(d => d.hard)
            }
        ]
    });


    // Hacer los charts responsivos
    window.addEventListener("resize", function () {
        dailyChart.resize();
        cwChart.resize();
        avgChart.resize();
        timeChart.resize();
    });
}
function groupProblemsByTimeRange(avgTimeData) {
    const ranges = {
        "<30s": 0,
        "30–60s": 0,
        "1–2 min": 0,
        "2–5 min": 0,
        ">5 min": 0
    };

    avgTimeData.forEach(p => {
        const t = p.avg_time;

        if (t < 30) ranges["<30s"]++;
        else if (t < 60) ranges["30–60s"]++;
        else if (t < 120) ranges["1–2 min"]++;
        else if (t < 300) ranges["2–5 min"]++;
        else ranges[">5 min"]++;
    });

    return ranges;
}
// Configurar listeners del modal
function setupModalListeners() {
    // Cerrar modal al hacer click fuera
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeUserModal();
            }
        });
    }

    // Cerrar modal con botón X
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeUserModal);
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeUserModal();
        }
    });
}

// Iniciar cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        initDashboard();
        setupModalListeners();
    });
} else {
    initDashboard();
    setupModalListeners();
}
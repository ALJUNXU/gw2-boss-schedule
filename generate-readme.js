/**
 * 激战2 BOSS轮换查询 - README 生成脚本
 * 由 GitHub Actions 每周日凌晨调用，生成当周 BOSS 数据到 README.md
 */

const fs = require('fs');
const path = require('path');

// === 数据定义 ===
const cycleData = [
    ["席瓦雪山小径", "以太之刃的藏身处", "斯洛萨索", "卡迪姆"],
    ["亡者之音和亡者之爪", "萨比尔（风灵）", "马蒂亚斯", "无可匹敌卡迪姆"],
    ["卓玛爪牙法兰涅尔", "卓玛低语", "琦拉", "无魂惧魔"],
    ["多变藤戈瑟瓦尔", "山谷守护者", "萨玛洛格", "丰收神殿"],
    ["凯玲", "宇宙观测台", "咒术融合体", "德姆"],
    ["末世魔监工", "冷战", "孪生蝶翼人", "格里尔"],
    ["席瓦雪山小径", "骸骨剥皮怪", "迪西玛", "卡迪姆"],
    ["亡者之音和亡者之爪", "萨蓓莎", "艾迪娜（土灵）", "无可匹敌卡迪姆"],
    ["卓玛爪牙法兰涅尔", "桑莱废料场", "旧雄狮广场", "无魂惧魔"],
    ["多变藤戈瑟瓦尔", "菲勃神殿", "厄拉", "丰收神殿"],
    ["凯玲", "要塞构造体", "凯宁瞭望台", "德姆"],
    ["末世魔监工", "守护者林地（齐拉）", "戴莫斯", "格里尔"]
];

const allBosses = [
    {name: "冷战", type: "进攻本", dlc: "冰巢传说"},
    {name: "卓玛爪牙法兰涅尔", type: "进攻本", dlc: "冰巢传说"},
    {name: "席瓦雪山小径", type: "进攻本", dlc: "冰巢传说"},
    {name: "亡者之音和亡者之爪", type: "进攻本", dlc: "冰巢传说"},
    {name: "卓玛低语", type: "进攻本", dlc: "冰巢传说"},
    {name: "骸骨剥皮怪", type: "进攻本", dlc: "冰巢传说"},
    {name: "以太之刃的藏身处", type: "进攻本", dlc: "巨龙绝境"},
    {name: "桑莱废料场", type: "进攻本", dlc: "巨龙绝境"},
    {name: "凯宁瞭望台", type: "进攻本", dlc: "巨龙绝境"},
    {name: "丰收神殿", type: "进攻本", dlc: "巨龙绝境"},
    {name: "旧雄狮广场", type: "进攻本", dlc: "巨龙绝境"},
    {name: "宇宙观测台", type: "进攻本", dlc: "天界之谜"},
    {name: "菲勃神殿", type: "进攻本", dlc: "天界之谜"},
    {name: "守护者林地（齐拉）", type: "进攻本", dlc: "永恒愿景"},

    {name: "山谷守护者", type: "十人本1线", dlc: ""},
    {name: "多变藤戈瑟瓦尔", type: "十人本1线", dlc: ""},
    {name: "灵魂树林（站圈拿火把）", type: "十人本1线", dlc: ""},
    {name: "破坏者萨蓓莎", type: "十人本1线", dlc: ""},

    {name: "斯洛萨索", type: "十人本2线", dlc: ""},
    {name: "囚犯集中营", type: "十人本2线", dlc: ""},
    {name: "马蒂亚斯", type: "十人本2线", dlc: ""},

    {name: "沉默的麦克劳德", type: "十人本3线", dlc: ""},
    {name: "要塞构造体", type: "十人本3线", dlc: ""},
    {name: "穿越扭曲城堡（机制）", type: "十人本3线", dlc: ""},
    {name: "琦拉", type: "十人本3线", dlc: ""},

    {name: "不屈的凯玲", type: "十人本4线", dlc: ""},
    {name: "末世魔监工", type: "十人本4线", dlc: ""},
    {name: "萨玛洛格", type: "十人本4线", dlc: ""},
    {name: "戴莫斯", type: "十人本4线", dlc: ""},

    {name: "无魂惧魔", type: "十人本5线", dlc: ""},
    {name: "魂河（机制）", type: "十人本5线", dlc: ""},
    {name: "古兰斯三雕像", type: "十人本5线", dlc: ""},
    {name: "德姆", type: "十人本5线", dlc: ""},

    {name: "咒术融合体", type: "十人本6线", dlc: ""},
    {name: "孪生蝶翼人", type: "十人本6线", dlc: ""},
    {name: "卡迪姆", type: "十人本6线", dlc: ""},

    {name: "艾迪娜（土灵）", type: "十人本7线", dlc: ""},
    {name: "萨比尔（风灵）", type: "十人本7线", dlc: ""},
    {name: "无可匹敌卡迪姆", type: "十人本7线", dlc: ""},

    {name: "迪西玛", type: "十人本8线", dlc: ""},
    {name: "格里尔", type: "十人本8线", dlc: ""},
    {name: "厄拉", type: "十人本8线", dlc: ""}
];

const permanentMissedBosses = [
    "灵魂树林（站圈拿火把）", "囚犯集中营", "穿越扭曲城堡（机制）",
    "魂河（机制）", "古兰斯三雕像", "沉默的麦克劳德"
];

// 基准日：2026-03-25 对应 cycleData[0]
const startDate = new Date(2026, 2, 25); // 本地时区

const weekDayNames = ["日", "一", "二", "三", "四", "五", "六"];

// === 工具函数 ===

function normalizeBossName(name) {
    const clean = name.trim();
    if (clean === "凯玲") return "不屈的凯玲";
    if (clean === "萨蓓莎") return "破坏者萨蓓莎";
    return clean;
}

function getDailyBosses(targetDate) {
    const deltaMs = targetDate.getTime() - startDate.getTime();
    const deltaDays = Math.floor(deltaMs / 86400000);
    const cycleIndex = (deltaDays + 1200) % 12;
    return cycleData[cycleIndex];
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(date) {
    return `${date.getFullYear()}/${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}`;
}

function getCurrentWeekSunday() {
    const today = new Date();
    const day = today.getDay(); // 0=周日
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day);
    return sunday;
}

// === 生成逻辑 ===

function generateReadme() {
    const sunday = getCurrentWeekSunday();
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    const weekBossNames = new Set();
    const weekRows = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        const dateStr = formatDate(d);
        const weekday = `周${weekDayNames[d.getDay()]}`;
        const bosses = getDailyBosses(d);
        weekBossNames.add(normalizeBossName(bosses[0]));
        weekBossNames.add(normalizeBossName(bosses[1]));
        weekBossNames.add(normalizeBossName(bosses[2]));
        weekBossNames.add(normalizeBossName(bosses[3]));
        weekRows.push(`| ${dateStr} ${weekday} | ${bosses[0]} | ${bosses[1]} | ${bosses[2]} | ${bosses[3]} |`);
    }

    // 计算未轮换BOSS
    const missed = allBosses.filter(b => {
        if (permanentMissedBosses.includes(b.name)) return true;
        return !weekBossNames.has(normalizeBossName(b.name));
    });

    const groups = {};
    const order = [
        "进攻本-冰巢传说", "进攻本-巨龙绝境", "进攻本-天界之谜", "进攻本-永恒愿景",
        "十人本1线", "十人本2线", "十人本3线", "十人本4线",
        "十人本5线", "十人本6线", "十人本7线", "十人本8线"
    ];
    missed.forEach(b => {
        const key = b.type.includes("十人本") ? b.type : `进攻本-${b.dlc}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(b);
    });

    // 构建未轮换BOSS文本
    let missedText = '';
    order.forEach(key => {
        if (!groups[key]) return;
        const names = groups[key].map(b => {
            if (permanentMissedBosses.includes(b.name)) {
                return `~~${b.name}~~`;
            }
            return b.name;
        }).join('、');
        missedText += `- **${key}**：${names}\n`;
    });

    const updateDate = formatDate(new Date());
    const weekRange = `${formatDate(sunday)} - ${formatDate(saturday)}`;

    const readme = `# 激战2 BOSS轮换查询

> 数据更新时间：${updateDate} | 本周范围：${weekRange}
>
> 数据基于 2026/03/25 周期第1天，12天循环

## 本周轮换日程

| 日期 | BOSS 1 | BOSS 2 | BOSS 3 | BOSS 4 |
|------|--------|--------|--------|--------|
${weekRows.join('\n')}

## 本周未轮换到的BOSS

${missedText}

> ~~删除线~~ 表示机制类BOSS，正常轮换中不会出现

## 在线查询

打开 [index.html](index.html) 可查看交互式查询页面，支持选择任意周日查看对应周的轮换。

---

*此页面由 GitHub Actions 每周日凌晨自动生成*
`;

    return readme;
}

// === 主程序 ===
const readmeContent = generateReadme();
const outputPath = path.join(__dirname, 'README.md');
fs.writeFileSync(outputPath, readmeContent, 'utf-8');
console.log('README.md generated successfully.');
console.log('Week range:', readmeContent.match(/本周范围：(.+)/)?.[1] || 'unknown');

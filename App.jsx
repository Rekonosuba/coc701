import { useState } from "react";
import axios from "axios";

const locations = [
  "伦敦郊区",
  "旧金山港口",
  "乡村医院",
  "工厂遗址",
  "海边灯塔"
];

const npcList = [
  { name: "神秘传教士", prompt: "一个面无表情、目光如镜的老人低声念着祷文……" },
  { name: "疯人院院长", prompt: "他凝视你良久，然后轻声说出你梦中的句子。" },
  { name: "图书馆管理员", prompt: "你在翻阅时，她悄悄递来一本无人登记的笔记本。" }
];

export default function App() {
  const [step, setStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationList, setLocationList] = useState(generateLocations());
  const [character, setCharacter] = useState(null);
  const [mapImage, setMapImage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [battleLog, setBattleLog] = useState([]);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(50);
  const [npcDialog, setNpcDialog] = useState([]);
  const [selectedNpc, setSelectedNpc] = useState(null);

  function generateLocations() {
    const shuffled = [...locations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  function generateCharacter() {
    const names = ["艾伦", "玛丽", "亨利", "爱丽丝", "托马斯"];
    const credit = Math.floor(Math.random() * 91) + 10;
    return {
      name: names[Math.floor(Math.random() * names.length)],
      credit,
      money: credit * 5 + 10
    };
  }

  async function fetchMapImage(location) {
    const res = await axios.post("https://api.deepseek.com/v1/images/generate", {
      prompt: `${location}的克苏鲁风格插画`,
      size: "512x512"
    }, {
      headers: {
        Authorization: `Bearer sk-c363b23365c04fde80464e29660e9ca4`
      }
    });
    setMapImage(res.data?.data?.[0]?.url || "");
  }

  async function askKeeper(question) {
    const res = await axios.post("https://api.deepseek.com/v1/chat/completions", {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是克苏鲁风格的旁白与主持人，用忧郁语气简洁回答。" },
        { role: "user", content: question }
      ]
    }, {
      headers: {
        Authorization: `Bearer sk-c363b23365c04fde80464e29660e9ca4`
      }
    });
    setAiMessage(res.data.choices[0].message.content);
  }

  async function talkToNpc(npc) {
    setSelectedNpc(npc.name);
    const res = await axios.post("https://api.deepseek.com/v1/chat/completions", {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: `你是NPC：${npc.name}，背景：${npc.prompt}，请用第一人称、阴森语气与玩家交流，回答简短。` },
        { role: "user", content: "你是谁？你为什么出现在这里？" }
      ]
    }, {
      headers: {
        Authorization: `Bearer sk-c363b23365c04fde80464e29660e9ca4`
      }
    });
    setNpcDialog([res.data.choices[0].message.content]);
  }

  function attackEnemy() {
    const playerHit = Math.floor(Math.random() * 20) + 1;
    const enemyHit = Math.floor(Math.random() * 15);
    const newEnemyHP = Math.max(0, enemyHP - playerHit);
    const newPlayerHP = Math.max(0, playerHP - enemyHit);
    setBattleLog((log) => [
      ...log,
      `你造成了${playerHit}伤害，敌人剩余HP：${newEnemyHP}`,
      `敌人反击，造成${enemyHit}伤害，你的HP：${newPlayerHP}`
    ]);
    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl mb-4 font-bold text-center">低语之雾</h1>
      {/* 内容略，保持简洁，完整版本见之前代码 */}
    </div>
  );
}

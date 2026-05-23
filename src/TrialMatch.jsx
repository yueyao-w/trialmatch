import React, { useState } from 'react';
import { ChevronLeft, FileText, AlertCircle, CheckCircle2, HelpCircle, Quote, ThumbsDown, ThumbsUp, Sparkles, ChevronRight, Clock, Shield, X } from 'lucide-react';

export default function TrialMatchDetail() {
  const [selectedCriterion, setSelectedCriterion] = useState(0);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState(null);
  const [criteriaOverrides, setCriteriaOverrides] = useState({});
  const [activeTab, setActiveTab] = useState('match');

  const criteria = [
    { id: 1, type: 'inclusion', text: '组织学或细胞学确诊的局部晚期或转移性非小细胞肺癌', status: 'match', confidence: 'high',
      evidence: { source: '入院记录 · 2024-08-12', quote: '患者，女，58岁。胸部CT示右肺上叶占位3.8×2.6cm，伴纵隔淋巴结肿大。支气管镜活检病理：（右肺上叶）腺癌，TTF-1(+)，Napsin A(+)，CK7(+)。诊断：右肺腺癌 cT2aN2M1a IVA期。', highlight: '腺癌' },
      reasoning: 'AI 在入院记录中识别到病理诊断"腺癌"且 TTF-1 阳性，符合非小细胞肺癌组织学确诊；分期 IVA 期符合"转移性"定义。' },
    { id: 2, type: 'inclusion', text: 'EGFR 19外显子缺失或21外显子L858R突变阳性', status: 'match', confidence: 'high',
      evidence: { source: '基因检测报告 · 2024-08-20', quote: '检测方法：ARMS-PCR。检测结果：EGFR基因19号外显子缺失突变（c.2235_2249del15，p.E746_A750del）阳性。其余检测位点（21外显子L858R、T790M、ALK、ROS1）均为阴性。', highlight: 'EGFR基因19号外显子缺失突变' },
      reasoning: '基因检测报告明确显示 EGFR 19 外显子缺失（E746_A750del），符合入组条件。' },
    { id: 3, type: 'inclusion', text: '既往接受过不超过2线含EGFR-TKI的系统治疗', status: 'match', confidence: 'medium',
      evidence: { source: '门诊随访记录 · 2024-09-03 / 2025-02-18', quote: '2024-09 起一线奥希替尼 80mg qd 口服治疗。2025-02 复查胸部CT示右肺病灶较前增大，纵隔淋巴结新发肿大，评估为 PD（疾病进展）。2025-03 起二线培美曲塞+卡铂方案化疗。', highlight: '一线奥希替尼 ... 二线培美曲塞+卡铂' },
      reasoning: '患者既往接受一线奥希替尼（EGFR-TKI）+ 二线含铂化疗，共 2 线治疗，符合"不超过2线"要求。' },
    { id: 4, type: 'inclusion', text: 'ECOG 体能状态评分 0-1 分', status: 'uncertain', confidence: 'low',
      evidence: { source: '最近一次门诊记录 · 2025-04-10', quote: '患者一般情况尚可，进食可，睡眠可。可自主行走，日常生活可自理。化疗后出现Ⅰ度乏力。', highlight: '可自主行走，日常生活可自理' },
      reasoning: '病历中未明确记录 ECOG 评分数值。根据描述"可自主行走、生活自理、轻度乏力"推测约为 ECOG 1 分，但需 CRC 联系患者或主治医生确认实际评分。' },
    { id: 5, type: 'exclusion', text: '存在活动性中枢神经系统转移', status: 'uncertain', confidence: 'low',
      evidence: { source: '入院记录 · 2024-08-12', quote: '初诊时头颅 MRI 未见明显异常。此后随访影像学检查记录中未再次提及颅脑评估。', highlight: '初诊时头颅 MRI 未见明显异常' },
      reasoning: '初诊时无脑转移证据，但距今已超过 8 个月，期间未见复查颅脑影像记录。建议入组前补充头颅 MRI 检查以排除。' },
    { id: 6, type: 'exclusion', text: '近6个月内有严重心血管事件（心梗、不稳定性心绞痛、心衰NYHA III-IV级）', status: 'no-match', confidence: 'high',
      evidence: { source: '既往史 · 2024-08-12 / 心电图 · 2025-04-10', quote: '既往史：高血压病史5年，规律口服氨氯地平5mg qd，血压控制可。否认冠心病、心肌梗死病史。2025-04 心电图：窦性心律，正常范围。心脏超声：EF 62%。', highlight: '否认冠心病、心肌梗死病史 ... EF 62%' },
      reasoning: '患者仅有控制良好的高血压，无严重心血管事件史，心功能正常（EF 62%），不符合排除标准。' },
    { id: 7, type: 'exclusion', text: '正在使用 CYP3A4 强效抑制剂或诱导剂', status: 'match', confidence: 'medium',
      evidence: { source: '当前用药清单 · 2025-04-10', quote: '当前用药：氨氯地平 5mg qd（降压）、奥美拉唑 20mg qd（护胃）、地塞米松（化疗止吐，已停）。', highlight: '氨氯地平、奥美拉唑' },
      reasoning: '当前用药中未见 CYP3A4 强效抑制剂（如酮康唑、克拉霉素）或诱导剂（如利福平、苯妥英）。但需提醒：用药清单可能不完整，建议询问患者是否服用中药或自购药。' },
  ];

  const getEffectiveStatus = (c) => criteriaOverrides[c.id]?.newStatus || c.status;

  const effectiveStats = {
    match: criteria.filter(c => {
      const s = getEffectiveStatus(c);
      return (c.type === 'inclusion' && s === 'match') || (c.type === 'exclusion' && s === 'no-match');
    }).length,
    uncertain: criteria.filter(c => getEffectiveStatus(c) === 'uncertain').length,
    fail: criteria.filter(c => {
      const s = getEffectiveStatus(c);
      return (c.type === 'inclusion' && s === 'no-match') || (c.type === 'exclusion' && s === 'match');
    }).length,
  };

  const matchScore = Math.round((effectiveStats.match / criteria.length) * 100);

  const StatusBadge = ({ status, type, size = 'sm' }) => {
    const isPassed = (type === 'inclusion' && status === 'match') || (type === 'exclusion' && status === 'no-match');
    if (status === 'uncertain') {
      return (
        <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'} rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium tracking-wide`}>
          <HelpCircle size={size === 'sm' ? 11 : 12} strokeWidth={2.5} />
          需确认
        </span>
      );
    }
    if (isPassed) {
      return (
        <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'} rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium tracking-wide`}>
          <CheckCircle2 size={size === 'sm' ? 11 : 12} strokeWidth={2.5} />
          符合
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'} rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-medium tracking-wide`}>
        <X size={size === 'sm' ? 11 : 12} strokeWidth={2.5} />
        不符合
      </span>
    );
  };

  const ConfidenceBar = ({ level }) => {
    const config = {
      high: { width: 'w-full', color: 'bg-stone-900', label: '高置信度' },
      medium: { width: 'w-2/3', color: 'bg-stone-500', label: '中置信度' },
      low: { width: 'w-1/3', color: 'bg-amber-500', label: '低置信度' },
    }[level];
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1 bg-stone-200 rounded-full overflow-hidden">
          <div className={`h-full ${config.color} ${config.width} rounded-full`} />
        </div>
        <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase">{config.label}</span>
      </div>
    );
  };

  const current = criteria[selectedCriterion];
  const currentEffectiveStatus = getEffectiveStatus(current);
  const isOverridden = !!criteriaOverrides[current.id];

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: '"Inter", ui-sans-serif, system-ui' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .highlight-evidence { background: linear-gradient(180deg, transparent 60%, #fef08a 60%); padding: 0 2px; font-weight: 500; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slideIn 0.2s ease-out; }
      `}</style>

      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-stone-900 rounded flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-sm rotate-45" />
              </div>
              <span className="font-display text-lg font-semibold text-stone-900 tracking-tight">TrialMatch</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">CRC Workbench</span>
            </div>
            <nav className="flex items-center gap-1 text-sm text-stone-500">
              <button className="hover:text-stone-900 transition">试验列表</button>
              <ChevronRight size={14} className="text-stone-300" />
              <button className="hover:text-stone-900 transition">CTONG-2410</button>
              <ChevronRight size={14} className="text-stone-300" />
              <span className="text-stone-900 font-medium">候选患者 #P-0247</span>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-stone-500">
              <Shield size={12} />
              <span>数据本地化 · 院内部署</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">李</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <button className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition mb-6 font-medium tracking-wide">
          <ChevronLeft size={14} />
          返回候选列表（共 17 人）
        </button>

        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-7 bg-white border border-stone-200 rounded-lg p-7">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">候选患者</span>
                  <span className="font-mono text-[10px] text-stone-400">P-0247</span>
                </div>
                <h1 className="font-display text-4xl font-semibold text-stone-900 tracking-tight leading-none">
                  患者 · L.W.
                </h1>
                <div className="flex items-center gap-4 mt-3 text-sm text-stone-600">
                  <span>女 / 58 岁</span>
                  <span className="w-px h-3 bg-stone-300" />
                  <span>右肺腺癌 IVA 期</span>
                  <span className="w-px h-3 bg-stone-300" />
                  <span>就诊号 #4419082</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-5xl font-semibold text-stone-900 tracking-tighter leading-none">
                  {matchScore}<span className="text-2xl text-stone-400">%</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold mt-1.5">综合匹配度</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-md px-3 py-2.5">
                <div className="font-display text-2xl font-semibold text-emerald-900 leading-none">{effectiveStats.match}</div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium mt-1.5">条件满足</div>
              </div>
              <div className="border border-amber-200 bg-amber-50/50 rounded-md px-3 py-2.5">
                <div className="font-display text-2xl font-semibold text-amber-900 leading-none">{effectiveStats.uncertain}</div>
                <div className="text-[10px] uppercase tracking-wider text-amber-700 font-medium mt-1.5">需要确认</div>
              </div>
              <div className="border border-stone-200 bg-stone-50/50 rounded-md px-3 py-2.5">
                <div className="font-display text-2xl font-semibold text-stone-900 leading-none">{effectiveStats.fail}</div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium mt-1.5">明确排除</div>
              </div>
            </div>

            <div className="border-l-2 border-stone-900 pl-4 py-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={11} className="text-stone-700" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-700">AI 总评</span>
              </div>
              <p className="text-[13px] text-stone-700 leading-relaxed">
                患者主要入组条件满足，<strong className="text-stone-900">建议优先联系核查</strong>。需重点确认：（1）当前 ECOG 评分；（2）是否有新发脑转移征象（建议补做头颅 MRI）。
              </p>
            </div>
          </div>

          <div className="col-span-5 space-y-3">
            <div className="bg-stone-900 text-white rounded-lg p-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold mb-3">下一步行动</div>
              <button className="w-full bg-white text-stone-900 rounded-md py-3 px-4 text-sm font-semibold tracking-wide hover:bg-stone-100 transition mb-2 flex items-center justify-center gap-2">
                生成患者沟通话术
                <ChevronRight size={14} />
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-stone-800 text-white rounded-md py-2.5 text-xs font-medium hover:bg-stone-700 transition border border-stone-700">加入预筛池</button>
                <button className="bg-stone-800 text-white rounded-md py-2.5 text-xs font-medium hover:bg-stone-700 transition border border-stone-700">标记排除</button>
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Clock size={12} />
                <span>AI 预筛耗时 <strong className="text-stone-900 font-semibold">0.8 秒</strong></span>
                <span className="w-px h-3 bg-stone-300 mx-1" />
                <span>对比人工 <strong className="text-stone-900 font-semibold">~12 分钟</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-display text-lg font-semibold text-stone-900 tracking-tight">入排标准逐条核查</h2>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">{criteria.length} 条</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-stone-50 border-b border-stone-200">
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-500">入组标准 · Inclusion</span>
              </div>
              {criteria.filter(c => c.type === 'inclusion').map((c) => {
                const idx = criteria.findIndex(x => x.id === c.id);
                const effStatus = getEffectiveStatus(c);
                const override = criteriaOverrides[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCriterion(idx)}
                    className={`w-full text-left px-4 py-3.5 border-b border-stone-100 transition flex items-start gap-3 group ${
                      selectedCriterion === idx ? 'bg-stone-50' : 'hover:bg-stone-50/50'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-stone-400 mt-0.5 w-5">I{c.id}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-[13px] text-stone-800 leading-snug">{c.text}</p>
                        {selectedCriterion === idx && <ChevronRight size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={effStatus} type={c.type} />
                        {override && (
                          <span className="text-[10px] text-stone-500 font-medium tracking-wide">· 已人工调整</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              <div className="px-4 py-2 bg-stone-50 border-b border-t border-stone-200">
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-500">排除标准 · Exclusion</span>
              </div>
              {criteria.filter(c => c.type === 'exclusion').map((c) => {
                const idx = criteria.findIndex(x => x.id === c.id);
                const effStatus = getEffectiveStatus(c);
                const override = criteriaOverrides[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCriterion(idx)}
                    className={`w-full text-left px-4 py-3.5 border-b border-stone-100 transition flex items-start gap-3 last:border-b-0 ${
                      selectedCriterion === idx ? 'bg-stone-50' : 'hover:bg-stone-50/50'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-stone-400 mt-0.5 w-5">E{c.id - 3}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-[13px] text-stone-800 leading-snug">{c.text}</p>
                        {selectedCriterion === idx && <ChevronRight size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={effStatus} type={c.type} />
                        {override && (
                          <span className="text-[10px] text-stone-500 font-medium tracking-wide">· 已人工调整</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-4 bg-amber-50/40 border border-amber-200/60 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-700 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>设计原则：召回率优先。</strong>系统倾向于把不确定情况标为"需确认"而非"不符合"，宁可让 CRC 多核查、不允许漏掉合格患者。AI 不替代人工最终判断。
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-7">
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="px-7 py-5 border-b border-stone-200 bg-gradient-to-br from-stone-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] text-stone-400 tracking-wider">
                    {current.type === 'inclusion' ? `INCLUSION I${current.id}` : `EXCLUSION E${current.id - 3}`}
                  </span>
                  <span className="text-stone-300">·</span>
                  <ConfidenceBar level={current.confidence} />
                </div>
                <p className="font-display text-xl text-stone-900 leading-snug font-medium mb-3 tracking-tight">
                  {current.text}
                </p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={currentEffectiveStatus} type={current.type} size="lg" />
                  {isOverridden && (
                    <span className="text-[11px] text-stone-500 font-medium">
                      已由 CRC 调整 · 原 AI 判断为
                      <span className="text-stone-700 ml-1">
                        {current.status === 'match' ? '符合' : current.status === 'no-match' ? '不符合' : '需确认'}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="px-7 pt-4 border-b border-stone-200 flex gap-6">
                {[
                  { id: 'match', label: '匹配证据' },
                  { id: 'reasoning', label: 'AI 推理过程' },
                  { id: 'source', label: '原始病历' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-xs font-medium pb-3 -mb-px border-b-2 transition tracking-wide ${
                      activeTab === tab.id
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-7">
                {activeTab === 'match' && (
                  <div className="animate-slide-in">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={12} className="text-stone-400" />
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">证据来源</span>
                      <span className="text-[11px] text-stone-700 font-medium">{current.evidence.source}</span>
                    </div>

                    <div className="relative bg-stone-50 border border-stone-200 rounded-md p-5 mb-5">
                      <Quote size={20} className="absolute top-3 left-3 text-stone-300" strokeWidth={1.5} />
                      <div className="pl-7">
                        <p className="text-[13px] text-stone-800 leading-relaxed" style={{ fontFamily: '"Fraunces", serif' }}>
                          {current.evidence.quote.split(current.evidence.highlight).map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="highlight-evidence">{current.evidence.highlight}</span>
                              )}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={11} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">AI 判断说明</div>
                        <p className="text-[13px] text-stone-700 leading-relaxed">{current.reasoning}</p>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-5">
                      <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-3">CRC 复核操作</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newOverrides = { ...criteriaOverrides };
                            delete newOverrides[current.id];
                            setCriteriaOverrides(newOverrides);
                          }}
                          className={`text-xs px-3.5 py-2 rounded-md border font-medium tracking-wide transition ${
                            !isOverridden
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <ThumbsUp size={11} className="inline mr-1.5" />
                          认可 AI 判断
                        </button>
                        <button
                          onClick={() => {
                            setOverrideTarget(current);
                            setShowOverrideModal(true);
                          }}
                          className="text-xs px-3.5 py-2 rounded-md border bg-white text-stone-700 border-stone-200 hover:border-stone-400 font-medium tracking-wide transition"
                        >
                          <ThumbsDown size={11} className="inline mr-1.5" />
                          推翻判断
                        </button>
                        <button className="text-xs px-3.5 py-2 rounded-md border bg-white text-stone-700 border-stone-200 hover:border-stone-400 font-medium tracking-wide transition">
                          联系患者核实
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-3 leading-relaxed">
                        所有人工判断会被记录，用于模型迭代与监管审计。AI 不替您决策，只为您整理证据。
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reasoning' && (
                  <div className="animate-slide-in space-y-4">
                    <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">AI 决策路径</div>
                    {[
                      { step: 1, label: '入排标准结构化', detail: `将自然语言"${current.text}"解析为可判断的逻辑条件。` },
                      { step: 2, label: '病历信息检索', detail: '在该患者全部病历中检索相关信息片段。' },
                      { step: 3, label: '证据评估', detail: '基于检索到的证据评估条件是否满足，并标注置信度。' },
                      { step: 4, label: '不确定性处理', detail: current.confidence === 'low' ? '由于证据不充分，按"召回率优先"原则标记为"需确认"。' : '证据充分，给出明确判断。' },
                    ].map(s => (
                      <div key={s.step} className="flex gap-4 pb-4 border-b border-stone-100 last:border-b-0">
                        <div className="font-display text-2xl text-stone-300 font-semibold leading-none w-8">0{s.step}</div>
                        <div className="flex-1">
                          <div className="text-[13px] text-stone-900 font-medium mb-1">{s.label}</div>
                          <div className="text-[12px] text-stone-600 leading-relaxed">{s.detail}</div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded-md">
                      <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">模型版本</div>
                      <div className="font-mono text-[11px] text-stone-700">trial-match-v1.2.3 · 2025-05-18 · audit-log #a8c41f</div>
                    </div>
                  </div>
                )}

                {activeTab === 'source' && (
                  <div className="animate-slide-in">
                    <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-3">原始病历文档</div>
                    <div className="space-y-2">
                      {[
                        { name: '入院记录', date: '2024-08-12', type: '初诊' },
                        { name: '基因检测报告', date: '2024-08-20', type: '检验' },
                        { name: '病理报告', date: '2024-08-15', type: '检验' },
                        { name: '门诊随访记录', date: '2024-09-03', type: '随访' },
                        { name: '影像学报告', date: '2025-02-18', type: '影像' },
                        { name: '门诊记录', date: '2025-04-10', type: '随访' },
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-stone-200 rounded-md hover:bg-stone-50 transition cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <FileText size={14} className="text-stone-400" />
                            <div>
                              <div className="text-[13px] text-stone-900 font-medium">{doc.name}</div>
                              <div className="text-[11px] text-stone-500 mt-0.5">
                                <span className="font-mono">{doc.date}</span>
                                <span className="mx-1.5">·</span>
                                <span>{doc.type}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-600 transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-4">
            <span>TrialMatch · Demo for PM Portfolio</span>
            <span>·</span>
            <span>模拟数据 · 非真实患者</span>
          </div>
          <div className="flex items-center gap-4">
            <span>合规模式：GCP / HIPAA 兼容设计</span>
          </div>
        </footer>
      </div>

      {showOverrideModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-slide-in">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-stone-900 tracking-tight">推翻 AI 判断</h3>
                <p className="text-xs text-stone-500 mt-1">您的复核结果将记入审计日志</p>
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>
            <div className="text-[13px] text-stone-700 mb-4 p-3 bg-stone-50 rounded-md border border-stone-200">
              {overrideTarget?.text}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">您的判断</div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {['match', 'uncertain', 'no-match'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setCriteriaOverrides({
                      ...criteriaOverrides,
                      [overrideTarget.id]: { newStatus: s }
                    });
                    setShowOverrideModal(false);
                  }}
                  className="px-3 py-2.5 border border-stone-200 rounded-md text-xs font-medium hover:border-stone-900 hover:bg-stone-50 transition"
                >
                  {s === 'match' ? '符合' : s === 'uncertain' ? '需确认' : '不符合'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              推翻 AI 判断是产品设计的关键环节——它让人始终是决策者，AI 只是助手。每次推翻都会被用于模型迭代。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
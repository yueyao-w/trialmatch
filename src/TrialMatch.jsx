import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, FileText, AlertCircle, CheckCircle2, HelpCircle, Quote,
  ThumbsDown, ThumbsUp, Sparkles, ChevronRight, Clock, Shield, X,
  Phone, ClipboardList, BookOpen, Copy, RefreshCw, Info,
} from 'lucide-react';

export default function TrialMatchDetail() {
  const navigate = useNavigate();
  const [selectedCriterion, setSelectedCriterion] = useState(0);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideTarget, setOverrideTarget] = useState(null);
  const [criteriaOverrides, setCriteriaOverrides] = useState({});
  const [activeTab, setActiveTab] = useState('match');

  // drawer state
  const [showScriptDrawer, setShowScriptDrawer] = useState(false);
  const [scriptPurpose, setScriptPurpose] = useState('invite');
  const [scriptDepth, setScriptDepth] = useState('detailed');
  const [scriptRisk, setScriptRisk] = useState('standard');
  const [regenerating, setRegenerating] = useState(false);
  const [regenCount, setRegenCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  // toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fireToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleContactPatient = () => {
    fireToast('此功能将在 V2 接入医院通讯录与录音系统，演示版本暂未实现。');
  };

  const handleCopy = () => {
    const text = getScriptSections()
      .map(s => `【${s.title}】\n${s.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      setRegenCount(c => c + 1);
    }, 1400);
  };

  const handleExportPDF = () => {
    fireToast('PDF 导出功能将在 V2 版本实现，届时将支持院内模板。');
  };

  const handleCopySection = (idx, content) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopiedSection(idx);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getScriptSections = () => {
    // risk addons — injected at the END of 03 and 04 respectively
    const riskAdd03 = scriptRisk === 'thorough'
      ? '\n\n另外想提前告诉您，这个试验的常见不良反应包括皮疹、腹泻、口腔黏膜反应，发生率约 30–40%，多数为轻度。少数患者可能出现间质性肺炎，发生率约 3–5%，需要密切观察。如果出现这些情况，我们会有完整的应对方案。'
      : '';

    const riskAdd04 = scriptRisk === 'thorough'
      ? '\n\n另外说明一下，参加试验您不需要承担任何药费和检查费用，研究方会提供交通补贴。但您需要按方案要求定期到医院复查，约每 3 周一次。如果中途出现不良反应需要停药，我们会安排您回到标准治疗方案，不会影响您的诊疗。'
      : '';

    // ── 初次邀约 ──────────────────────────────────────────────
    if (scriptPurpose === 'invite') {
      if (scriptDepth === 'detailed') {
        return [
          {
            Icon: Phone, label: '01 · 开场', title: '开场白',
            content: `您好，请问是 W 女士本人吗？我是[医院]胸部肿瘤科的临床研究协调员，我姓李。您目前在我们科室由主治医生负责诊治。我今天致电是想向您介绍一项与您病情相关的临床研究，希望占用您约五到七分钟的时间。请问您现在方便接听吗？`,
          },
          {
            Icon: ClipboardList, label: '02 · 介绍', title: '临床研究基本信息',
            content: `好的，感谢您的时间。我们科室正在承担一项编号为 CTONG-2410 的 III 期临床研究，由阿斯利康公司申办，研究目的是评估奥希替尼联合化疗方案，在 EGFR 基因突变阳性肺腺癌一线治疗中的疗效与安全性。根据病历资料的初步评估，您的情况可能符合参与条件，因此研究医生希望我先与您沟通。我想特别说明：参与临床研究完全自愿，不参与不会对您在本院接受的任何常规治疗产生任何影响。`,
          },
          {
            Icon: HelpCircle, label: '03 · 核实', title: '关键信息核实（AI 标注需确认项）',
            content: `在进一步介绍前，我需要向您确认两项信息，这两项是研究入组的重要条件。

第一，请问您目前的日常活动状态怎么样？例如能否自行完成洗漱、家务、外出就医等日常事务？近期化疗结束后，有没有感到明显体力下降，需要在床上休息超过半天的情况？——这是评估体能状态的标准问题，医学上称为 ECOG 评分，能够自理日常生活一般记为 1 分，符合入组要求。

第二，近一两个月您有没有出现新发的头痛、视力变化、手脚麻木无力，或记忆力、理解力方面的明显变化？如果有上述情况，我们可能需要在正式入组前安排一次头颅 MRI 复查，以充分排查颅脑方面的影响。${riskAdd03}`,
          },
          {
            Icon: BookOpen, label: '04 · 流程', title: '知情同意与后续安排',
            content: `如果您有初步意向，下一步我们会安排您与研究医生进行详细面谈，医生会向您介绍研究方案的具体内容、潜在的获益与风险，以及研究期间的随访安排。届时会给您一份知情同意书，您可以带回家仔细阅读，也欢迎家属一同参与讨论。您在任何阶段均可退出研究，无需给出理由，也不会影响后续治疗。请问您现在有什么问题想问我的吗？如果需要时间考虑，请告诉我一个方便回电确认的时间。${riskAdd04}`,
          },
        ];
      }
      return [
        {
          Icon: Phone, label: '01 · 开场', title: '开场白',
          content: `您好，请问是 W 女士本人吗？我是[医院]胸部肿瘤科的临床研究协调员，我姓李。我今天致电是想向您介绍一项临床研究，只需要占用您两三分钟。请问现在方便吗？`,
        },
        {
          Icon: ClipboardList, label: '02 · 核心', title: '试验简介与关键确认',
          content: `我们科室正承担 CTONG-2410 研究，由阿斯利康申办，评估奥希替尼联合化疗方案治疗 EGFR 突变阳性肺腺癌的效果。根据初步评估，您可能符合参与条件。在介绍详情前需向您确认两点：一是近期体力和日常活动是否正常、能否自理；二是近期有无新发头痛、视力变化等神经系统症状。${riskAdd03}`,
        },
        {
          Icon: BookOpen, label: '03 · 后续', title: '后续步骤',
          content: `如有意向，下一步会安排您与研究医生面谈，详细介绍方案内容及知情同意要求。参与完全自愿，可随时退出，不影响正常诊疗。请问您有什么问题，或者是否方便进一步了解？${riskAdd04}`,
        },
      ];
    }

    // ── 入组前确认 ────────────────────────────────────────────
    if (scriptPurpose === 'confirm') {
      if (scriptDepth === 'detailed') {
        return [
          {
            Icon: Phone, label: '01 · 回访', title: '回访开场',
            content: `您好，W 女士，我是[医院]胸部肿瘤科的临床研究协调员李[姓]。我们上次沟通时，您表示有参加 CTONG-2410 研究的意向，非常感谢您的信任。我今天致电是想和您确认入组前的最后几项细节，并安排知情同意面谈的时间。请问您现在方便接听吗？`,
          },
          {
            Icon: ClipboardList, label: '02 · 确认', title: '入组前最终核实',
            content: `好的。在正式签署知情同意书之前，我需要向您再核实两项信息：

关于体能状态：上次提到需要评估您目前的日常活动能力，我们会在面谈时由研究医生直接为您评估 ECOG 评分——请问近期状态和之前相比有没有明显变化？

关于颅脑检查：研究方案要求入组前完成一次头颅 MRI，以排除活动性脑转移。我们会安排在面谈当天顺带完成，不需要您额外再跑一次医院。请问近期有没有出现头痛、视物模糊等新发症状？${riskAdd03}`,
          },
          {
            Icon: HelpCircle, label: '03 · 疑问', title: '还有什么需要确认的？',
            content: `在正式签署前，您还有什么疑虑或者没想清楚的地方吗？这完全正常——知情同意书本身就是一份需要认真阅读的文件。我们鼓励您把任何问题留到面谈时当面问研究医生。家属也可以一同参加，我们非常欢迎。`,
          },
          {
            Icon: BookOpen, label: '04 · 安排', title: '面谈时间预约',
            content: `好的，那我们来定一下面谈时间。整个面谈大概需要一到一个半小时，包括研究医生详细介绍方案、签署知情同意书，以及安排后续基线检查的预约。请问您本周或者下周哪天上午方便过来？我会提前和研究医生确认时间并发短信通知您。${riskAdd04}`,
          },
        ];
      }
      return [
        {
          Icon: Phone, label: '01 · 回访', title: '回访开场',
          content: `您好，W 女士，我是[医院]胸部肿瘤科临床研究协调员李[姓]。上次您表示有参加 CTONG-2410 研究的意向，我今天致电是来安排入组面谈时间的。请问现在方便说话吗？`,
        },
        {
          Icon: ClipboardList, label: '02 · 核心', title: '入组前确认',
          content: `签署知情同意书前需再确认两点：ECOG 体能状态（研究医生面谈时直接评估）和入组前头颅 MRI（安排当天一并完成）。请问近期体力状态和神经系统方面有无新变化？还有什么问题需要在见面前解答？${riskAdd03}`,
        },
        {
          Icon: BookOpen, label: '03 · 预约', title: '预约面谈',
          content: `好的，那我们来安排面谈时间，约需一到一个半小时，包含知情同意签署和基线检查预约。请问本周或下周哪天上午方便？我会提前发短信确认。${riskAdd04}`,
        },
      ];
    }

    // ── 解答疑问 ──────────────────────────────────────────────
    if (scriptDepth === 'detailed') {
      return [
        {
          Icon: Phone, label: '01 · 开场', title: '开场与回顾',
          content: `您好，W 女士，我是[医院]胸部肿瘤科临床研究协调员李[姓]。上次和您介绍了 CTONG-2410 研究，您说想再多了解一些——我今天专门致电是来解答您的疑问的。不管是什么顾虑，您都可以直接问我，没有任何问题是奇怪的。请问您现在方便聊吗？`,
        },
        {
          Icon: ClipboardList, label: '02 · 解答', title: '主动回应常见顾虑',
          content: `很多患者在了解临床研究时会有类似的担心，我把几个常见的问题先主动说一下：

关于"是否会影响我现在的治疗"：参加研究期间，您仍然由原来的主治医生负责诊治。联合方案是在标准治疗基础上的强化，而不是替代。如果中途需要调整，研究团队会第一时间处理。

关于"副作用是否会更严重"：联合化疗确实比单药有略多的副作用风险，但研究团队会全程密切监测，所有检查和用药免费，并有完整的不良反应预案。

关于"时间和精力的投入"：研究随访周期约每 3 周一次，可以和常规复查合并安排，尽量减少您额外跑医院的次数。`,
        },
        {
          Icon: HelpCircle, label: '03 · 核实', title: '关键信息核实（入组必要评估）',
          content: `在回答您的问题之余，我也需要向您确认两项信息，这是入组评估的必要内容：

第一，请问您目前日常活动和体力状态怎么样？能否自行完成洗漱、外出就医等？研究医生会在面谈时正式评定体能评分，今天我只是先了解一下大概情况。

第二，近期有没有出现新发的头痛或者神经系统方面的症状？如果有，入组前我们需要安排一次头颅 MRI 复查，我们会帮您统一安排，不需要您自己预约。${riskAdd03}`,
        },
        {
          Icon: BookOpen, label: '04 · 引导', title: '引导下一步',
          content: `我理解做这个决定需要权衡很多方面，完全不需要着急。如果您还有其他疑问，可以随时拨打这个电话，或者让我帮您约研究医生直接面谈——有些问题面对面解释会比电话清楚得多。如果您目前感觉疑虑已经基本得到解答，我们也可以初步安排入组面谈的时间，您随时可以在签署前再反悔。请问您现在的想法是怎样的？${riskAdd04}`,
        },
      ];
    }
    return [
      {
        Icon: Phone, label: '01 · 开场', title: '开场与回顾',
        content: `您好，W 女士，我是[医院]胸部肿瘤科临床研究协调员李[姓]。上次介绍了 CTONG-2410 研究，您有一些疑问想了解。今天致电就是来解答您的顾虑的，请问现在方便吗？`,
      },
      {
        Icon: ClipboardList, label: '02 · 解答', title: '主要顾虑解答',
        content: `参加研究不会影响您的现有治疗，副作用有完整监测预案，随访可与常规复查合并安排。关于 ECOG 体能评估和颅脑检查，我们会统一安排在面谈当天完成，不需要您额外跑一趟。${riskAdd03}`,
      },
      {
        Icon: BookOpen, label: '03 · 引导', title: '下一步',
        content: `如果主要疑虑已经解答，可以安排研究医生面谈，当面更详细解释，签前随时可以再反悔。您不需要现在就做决定。请问您目前倾向怎样？${riskAdd04}`,
      },
    ];
  };

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

  const ParamToggle = ({ options, value, onChange }) => (
    <div className="flex items-center gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-[11px] font-medium rounded transition tracking-wide ${
            value === opt.value
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const current = criteria[selectedCriterion];
  const currentEffectiveStatus = getEffectiveStatus(current);
  const isOverridden = !!criteriaOverrides[current.id];
  const scriptSections = getScriptSections();

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: '"Inter", ui-sans-serif, system-ui' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .highlight-evidence { background: linear-gradient(180deg, transparent 60%, #fef08a 60%); padding: 0 2px; font-weight: 500; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slideIn 0.2s ease-out; }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
        .drawer-enter { animation: slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        .overlay-enter { animation: overlayIn 0.2s ease-out; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .toast-enter { animation: toastIn 0.18s ease-out; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[100] toast-enter">
          <div className="flex items-start gap-2.5 bg-stone-900 text-white rounded-lg px-4 py-3 max-w-sm shadow-lg">
            <Info size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

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
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition mb-6 font-medium tracking-wide"
        >
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
              <button
                onClick={() => setShowScriptDrawer(true)}
                className="w-full bg-white text-stone-900 rounded-md py-3 px-4 text-sm font-semibold tracking-wide hover:bg-stone-100 transition mb-2 flex items-center justify-center gap-2"
              >
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
                        <button
                          onClick={handleContactPatient}
                          className="text-xs px-3.5 py-2 rounded-md border bg-white text-stone-700 border-stone-200 hover:border-stone-400 font-medium tracking-wide transition"
                        >
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

      {/* Override modal */}
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
                    setCriteriaOverrides({ ...criteriaOverrides, [overrideTarget.id]: { newStatus: s } });
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

      {/* Script drawer overlay */}
      {showScriptDrawer && (
        <div
          className="fixed inset-0 bg-stone-900/20 z-40 overlay-enter"
          onClick={() => setShowScriptDrawer(false)}
        />
      )}

      {/* Script drawer */}
      {showScriptDrawer && (
        <div className="fixed inset-y-0 right-0 w-[480px] bg-white border-l border-stone-200 z-50 flex flex-col drawer-enter shadow-2xl">

          {/* Drawer header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-stone-200 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-stone-600" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500">AI 生成</span>
                {regenCount > 0 && (
                  <span className="font-mono text-[10px] text-stone-400">· 第 {regenCount + 1} 版</span>
                )}
              </div>
              <h2 className="font-display text-xl font-semibold text-stone-900 tracking-tight leading-snug">
                患者沟通话术 · L.W.
              </h2>
              <p className="text-[11px] text-stone-500 mt-1">
                CTONG-2410 · {
                  { invite: '初次邀约', confirm: '入组前确认', questions: '解答疑问' }[scriptPurpose]
                }
              </p>
            </div>
            <button
              onClick={() => setShowScriptDrawer(false)}
              className="text-stone-400 hover:text-stone-800 transition mt-0.5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Parameters */}
          <div className="px-6 py-3 border-b border-stone-100 bg-stone-50/60 flex-shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold w-20">通话目的</span>
              <ParamToggle
                value={scriptPurpose}
                onChange={setScriptPurpose}
                options={[
                  { value: 'invite', label: '初次邀约' },
                  { value: 'confirm', label: '入组前确认' },
                  { value: 'questions', label: '解答疑问' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold w-20">沟通深度</span>
              <ParamToggle
                value={scriptDepth}
                onChange={setScriptDepth}
                options={[
                  { value: 'brief', label: '简版 2 分钟' },
                  { value: 'detailed', label: '详版 5–7 分钟' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold w-20">风险沟通</span>
              <ParamToggle
                value={scriptRisk}
                onChange={setScriptRisk}
                options={[
                  { value: 'standard', label: '标准' },
                  { value: 'thorough', label: '详尽' },
                ]}
              />
            </div>
          </div>

          {/* Script content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {regenerating ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <RefreshCw size={20} className="text-stone-400 spin" />
                <p className="text-[12px] text-stone-500">正在根据病历与方案重新生成…</p>
              </div>
            ) : (
              scriptSections.map((section, idx) => (
                <div key={`${scriptPurpose}-${scriptDepth}-${scriptRisk}-${idx}`} className="animate-slide-in group/section">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <section.Icon size={11} className="text-stone-600" strokeWidth={2} />
                      </div>
                      <span className="font-mono text-[10px] text-stone-400 tracking-wider">{section.label}</span>
                      <span className="text-stone-300 text-[10px]">·</span>
                      <span className="text-[11px] font-semibold text-stone-700 tracking-wide">{section.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopySection(idx, section.content)}
                      className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded transition font-medium
                        ${copiedSection === idx
                          ? 'text-emerald-700 opacity-100'
                          : 'text-stone-400 opacity-0 group-hover/section:opacity-100 hover:text-stone-600'
                        }`}
                    >
                      {copiedSection === idx
                        ? <><CheckCircle2 size={9} strokeWidth={2.5} />已复制</>
                        : <><Copy size={9} strokeWidth={2} />复制</>
                      }
                    </button>
                  </div>
                  <div className="pl-7">
                    <p
                      className="text-[13px] text-stone-800 leading-[1.85] whitespace-pre-line"
                      style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif' }}
                    >
                      {section.content}
                    </p>
                  </div>
                  {idx < scriptSections.length - 1 && (
                    <div className="mt-6 border-b border-stone-100" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Drawer footer */}
          <div className="flex-shrink-0 border-t border-stone-200 px-6 py-4 space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border transition tracking-wide ${
                  copied
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <Copy size={11} />
                {copied ? '已复制' : '复制全文'}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border bg-white text-stone-700 border-stone-200 hover:border-stone-400 transition tracking-wide"
              >
                <FileText size={11} />
                导出 PDF
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md bg-stone-900 text-white hover:bg-stone-800 transition tracking-wide ml-auto disabled:opacity-50"
              >
                <RefreshCw size={11} className={regenerating ? 'spin' : ''} />
                重新生成
              </button>
            </div>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              本话术由 AI 基于患者病历与试验方案生成，使用前请人工审阅。最终沟通效果由 CRC 经验决定。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

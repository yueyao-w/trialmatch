import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Shield, CheckCircle2, HelpCircle, X,
  ArrowDown, Clock, Users, Sparkles,
} from 'lucide-react';
import { PATIENTS, TRIAL } from './patients';

export default function CandidateList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  const counts = {
    all: PATIENTS.length,
    pending: PATIENTS.filter(p => p.status === 'pending').length,
    enrolled: PATIENTS.filter(p => p.status === 'enrolled').length,
    excluded: PATIENTS.filter(p => p.status === 'excluded').length,
  };

  const filtered = PATIENTS
    .filter(p => filter === 'all' || p.status === filter)
    .slice()
    .sort((a, b) =>
      sortBy === 'match' ? b.matchPct - a.matchPct : b.uncertain - a.uncertain
    );

  const matchColor = (pct) => {
    if (pct >= 70) return 'text-emerald-700';
    if (pct >= 40) return 'text-amber-700';
    return 'text-stone-500';
  };

  const progressPct = Math.round((TRIAL.enrolled / TRIAL.target) * 100);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: '"Inter", ui-sans-serif, system-ui' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
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
              <span className="text-stone-900 font-medium">{TRIAL.id}</span>
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

        {/* Trial info card */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[11px] text-stone-500 tracking-wider">{TRIAL.id}</span>
                <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded font-medium tracking-wider uppercase">{TRIAL.phase}</span>
                <span className="text-[11px] text-stone-400">申办方：{TRIAL.sponsor}</span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-stone-900 tracking-tight mb-5">
                {TRIAL.title}
              </h1>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">入组进度</div>
                  <div className="flex items-center gap-3">
                    <div className="w-36 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-900 rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-stone-900 tabular-nums">{TRIAL.enrolled} / {TRIAL.target}</span>
                    <span className="text-[11px] text-stone-400">人已入组</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">剩余时间</div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-stone-500" />
                    <span className="text-sm font-semibold text-stone-900">{TRIAL.daysLeft} 天</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">候选患者</div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-stone-500" />
                    <span className="text-sm font-semibold text-stone-900">{TRIAL.totalCandidates} 人</span>
                    <span className="text-[11px] text-stone-400">待预筛</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">AI 预筛</div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-stone-500" />
                    <span className="text-sm font-semibold text-stone-900">全部完成</span>
                    <span className="text-[11px] text-stone-400">· 平均 0.9 秒 / 人</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter + sort bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[
              { key: 'all',      label: `全部`, count: counts.all },
              { key: 'pending',  label: `未审`, count: counts.pending },
              { key: 'enrolled', label: `已加入预筛池`, count: counts.enrolled },
              { key: 'excluded', label: `已排除`, count: counts.excluded },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition tracking-wide ${
                  filter === tab.key
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-semibold tabular-nums ${
                  filter === tab.key ? 'text-stone-400' : 'text-stone-400'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">排序</span>
            {[
              { key: 'match',     label: '按匹配度' },
              { key: 'uncertain', label: '按需确认数' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition tracking-wide ${
                  sortBy === opt.key
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {opt.label}
                <ArrowDown size={10} />
              </button>
            ))}
          </div>
        </div>

        {/* Patient table */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">

          {/* Table header */}
          <div
            className="grid px-5 py-2.5 bg-stone-50 border-b border-stone-200
                        text-[10px] uppercase tracking-wider text-stone-500 font-semibold gap-4"
            style={{ gridTemplateColumns: '110px 148px 1fr 88px 220px 136px 24px' }}
          >
            <div>患者编号</div>
            <div>基本信息</div>
            <div>诊断</div>
            <div>匹配度</div>
            <div>AI 评估分布</div>
            <div>CRC 状态</div>
            <div />
          </div>

          {/* Rows */}
          {filtered.map((patient) => (
            <div
              key={patient.id}
              onClick={() => navigate(`/patient/${patient.id}`)}
              className={`grid px-5 py-4 border-b border-stone-100 last:border-b-0
                          items-center gap-4 cursor-pointer transition-colors hover:bg-stone-50/70
                          ${patient.status === 'excluded' ? 'opacity-50' : ''}`}
              style={{ gridTemplateColumns: '110px 148px 1fr 88px 220px 136px 24px' }}
            >
              {/* ID */}
              <div className="font-mono text-[12px] text-stone-600 font-medium">
                {patient.id}
              </div>

              {/* Basic info */}
              <div>
                <div className="text-[13px] text-stone-900 font-medium leading-snug">{patient.initials}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{patient.gender} / {patient.age} 岁</div>
              </div>

              {/* Diagnosis */}
              <div>
                <div className="text-[13px] text-stone-800 leading-snug">{patient.diagnosis}</div>
                <div className="mt-0.5">
                  <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {patient.mutation}
                  </span>
                </div>
              </div>

              {/* Match % */}
              <div className="flex items-baseline gap-0.5">
                <span className={`font-display text-xl font-semibold leading-none tabular-nums ${matchColor(patient.matchPct)}`}>
                  {patient.matchPct}
                </span>
                <span className={`text-xs font-medium ${matchColor(patient.matchPct)}`}>%</span>
              </div>

              {/* Three-state badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded font-semibold tabular-nums leading-none
                  ${patient.match > 0
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'}`}
                >
                  <CheckCircle2 size={9} strokeWidth={2.5} />
                  {patient.match} 符合
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded font-semibold tabular-nums leading-none
                  ${patient.uncertain > 0
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'}`}
                >
                  <HelpCircle size={9} strokeWidth={2.5} />
                  {patient.uncertain} 需确认
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded font-semibold tabular-nums leading-none
                  ${patient.fail > 0
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'}`}
                >
                  <X size={9} strokeWidth={2.5} />
                  {patient.fail} 不符
                </span>
              </div>

              {/* CRC status */}
              <div>
                {patient.status === 'enrolled' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium tracking-wide">
                    <CheckCircle2 size={10} strokeWidth={2.5} />
                    已加入预筛池
                  </span>
                )}
                {patient.status === 'excluded' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-md bg-stone-100 text-stone-500 border border-stone-200 font-medium tracking-wide">
                    <X size={10} strokeWidth={2.5} />
                    已排除
                  </span>
                )}
                {patient.status === 'pending' && (
                  <span className="text-[11px] text-stone-400 font-medium tracking-wide">未审</span>
                )}
              </div>

              {/* Arrow */}
              <div className="flex justify-end">
                <ChevronRight size={14} className="text-stone-300" />
              </div>
            </div>
          ))}
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
    </div>
  );
}

export const TRIAL = {
  id: 'CTONG-2410',
  title: '奥希替尼联合化疗一线治疗 EGFR 阳性肺腺癌（III 期随机对照研究）',
  sponsor: '阿斯利康',
  phase: 'Phase III',
  enrolled: 3,
  target: 5,
  daysLeft: 42,
  totalCandidates: 17,
};

// status: 'pending' | 'enrolled' | 'excluded'
// match / uncertain / fail sum equals total criteria count (7)
export const PATIENTS = [
  {
    id: 'P-0268', initials: 'E.V.', gender: '女', age: 61,
    diagnosis: '左肺腺癌 IIIB期', mutation: 'EGFR 19del',
    matchPct: 91, match: 6, uncertain: 0, fail: 1, status: 'pending',
  },
  {
    id: 'P-0089', initials: 'F.M.', gender: '女', age: 55,
    diagnosis: '右肺腺癌 IVA期', mutation: 'EGFR 19del',
    matchPct: 84, match: 5, uncertain: 1, fail: 1, status: 'enrolled',
  },
  {
    id: 'P-0401', initials: 'Z.J.', gender: '男', age: 67,
    diagnosis: '左肺腺癌 IIIA期', mutation: 'EGFR 19del',
    matchPct: 79, match: 5, uncertain: 1, fail: 1, status: 'pending',
  },
  {
    id: 'P-0312', initials: 'C.H.', gender: '男', age: 63,
    diagnosis: '右肺腺癌 IIIB期', mutation: 'EGFR L858R',
    matchPct: 79, match: 5, uncertain: 2, fail: 0, status: 'enrolled',
  },
  {
    id: 'P-0156', initials: 'T.Y.', gender: '女', age: 61,
    diagnosis: '右肺腺癌 IVB期', mutation: 'EGFR L858R',
    matchPct: 68, match: 4, uncertain: 3, fail: 0, status: 'pending',
  },
  {
    id: 'P-0518', initials: 'G.Q.', gender: '女', age: 44,
    diagnosis: '左肺腺癌 IIIB期', mutation: 'EGFR 19del',
    matchPct: 65, match: 4, uncertain: 2, fail: 1, status: 'pending',
  },
  {
    id: 'P-0233', initials: 'X.L.', gender: '男', age: 52,
    diagnosis: '右肺腺癌 IVA期', mutation: 'EGFR 20ins',
    matchPct: 62, match: 4, uncertain: 1, fail: 2, status: 'pending',
  },
  {
    id: 'P-0247', initials: 'L.W.', gender: '女', age: 58,
    diagnosis: '右肺腺癌 IVA期', mutation: 'EGFR 19del',
    matchPct: 57, match: 4, uncertain: 2, fail: 1, status: 'pending',
  },
  {
    id: 'P-0377', initials: 'B.K.', gender: '男', age: 70,
    diagnosis: '左肺腺癌 IVA期', mutation: 'EGFR L858R',
    matchPct: 57, match: 3, uncertain: 4, fail: 0, status: 'pending',
  },
  {
    id: 'P-0295', initials: 'R.S.', gender: '男', age: 57,
    diagnosis: '右肺腺癌 IIIB期', mutation: 'EGFR 19del',
    matchPct: 53, match: 3, uncertain: 3, fail: 1, status: 'pending',
  },
  {
    id: 'P-0144', initials: 'H.N.', gender: '女', age: 48,
    diagnosis: '右肺腺癌 IVB期', mutation: 'EGFR L858R',
    matchPct: 49, match: 3, uncertain: 2, fail: 2, status: 'excluded',
  },
  {
    id: 'P-0462', initials: 'D.Q.', gender: '女', age: 65,
    diagnosis: '左肺腺癌 IVA期', mutation: 'EGFR 少见突变',
    matchPct: 45, match: 3, uncertain: 2, fail: 2, status: 'pending',
  },
  {
    id: 'P-0183', initials: 'J.W.', gender: '男', age: 59,
    diagnosis: '右肺腺癌 IIIB期', mutation: 'EGFR 19del 复发',
    matchPct: 41, match: 2, uncertain: 5, fail: 0, status: 'pending',
  },
  {
    id: 'P-0327', initials: 'Y.P.', gender: '女', age: 72,
    diagnosis: '左肺腺癌 IVA期', mutation: 'EGFR L858R',
    matchPct: 37, match: 2, uncertain: 1, fail: 4, status: 'excluded',
  },
  {
    id: 'P-0081', initials: 'K.T.', gender: '男', age: 46,
    diagnosis: '右肺腺癌 IVB期', mutation: 'EGFR 19del',
    matchPct: 34, match: 2, uncertain: 3, fail: 2, status: 'pending',
  },
  {
    id: 'P-0414', initials: 'M.G.', gender: '女', age: 68,
    diagnosis: '左肺腺癌 IIIA期', mutation: 'EGFR 20ins',
    matchPct: 32, match: 2, uncertain: 0, fail: 5, status: 'pending',
  },
  {
    id: 'P-0502', initials: 'N.C.', gender: '男', age: 53,
    diagnosis: '右肺腺癌 IVA期', mutation: 'EGFR L858R',
    matchPct: 30, match: 1, uncertain: 0, fail: 6, status: 'pending',
  },
];

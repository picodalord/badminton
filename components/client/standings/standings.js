/**
 * =========================================================================
 * COMPONENT CLIENT: BẢNG XẾP HẠNG ĐA THỂ THỨC (GROUPS & SWISS)
 * =========================================================================
 */

let currentStandingsView = 'groups';

function switchStandingsView(view) {
  currentStandingsView = view;
  const groupsContainer = document.getElementById('groups-standings-container');
  const swissContainer = document.getElementById('swiss-standings-container');
  const tabGroupsBtn = document.getElementById('tab-groups-btn');
  const tabSwissBtn = document.getElementById('tab-swiss-btn');

  if (view === 'swiss') {
    groupsContainer?.classList.add('hidden');
    swissContainer?.classList.remove('hidden');
    tabSwissBtn?.classList.replace('bg-slate-800', 'bg-blue-600');
    tabSwissBtn?.classList.replace('text-slate-300', 'text-white');
    tabGroupsBtn?.classList.replace('bg-blue-600', 'bg-slate-800');
    tabGroupsBtn?.classList.replace('text-white', 'text-slate-300');
  } else {
    swissContainer?.classList.add('hidden');
    groupsContainer?.classList.remove('hidden');
    tabGroupsBtn?.classList.replace('bg-slate-800', 'bg-blue-600');
    tabGroupsBtn?.classList.replace('text-slate-300', 'text-white');
    tabSwissBtn?.classList.replace('bg-blue-600', 'bg-slate-800');
    tabSwissBtn?.classList.replace('text-white', 'text-slate-300');
  }
}

function renderClientStandings() {
  const tData = typeof tournamentData !== 'undefined' ? tournamentData : {};
  const teams = Object.values(tData.teams || {});
  const matches = Object.values(tData.matches || {});
  const metaBadge = document.getElementById('standings-meta-badge');

  // Tự động nhận diện thể thức cài đặt
  const isSwissFormat = tData.settings?.format === 'swiss' || matches.some(m => m.stage === 'swiss');
  if (metaBadge) {
    metaBadge.innerText = isSwissFormat ? 'Thể thức hiện tại: Hệ Thụy Sĩ' : 'Thể thức hiện tại: Chia Bảng';
  }

  // 1. RENDER BẢNG A, B, C (VÒNG BẢNG TRUYỀN THỐNG)
  renderGroupsView(teams, matches);

  // 2. RENDER HỆ THỤY SĨ (SWISS)
  renderSwissView(teams, matches);

  // Tự động bật tab tương ứng với thể thức hiện tại
  if (isSwissFormat) {
    switchStandingsView('swiss');
  } else {
    switchStandingsView('groups');
  }
}

// Hàm render chia nhóm Bảng A, B, C
function renderGroupsView(teams, matches) {
  const container = document.getElementById('groups-standings-container');
  if (!container) return;

  // Gom các đội theo thuộc tính group (A, B, C...)
  const groups = {};
  teams.forEach(t => {
    const grp = t.group || 'Bảng A';
    if (!groups[grp]) groups[grp] = [];
    groups[grp].push({ ...t, played: 0, won: 0, lost: 0, setsWon: 0, setsLost: 0, pts: 0 });
  });

  // Tính kết quả từ các trận vòng bảng
  matches.filter(m => m.stage === 'group' && (m.status === 'completed' || m.completed)).forEach(m => {
    Object.keys(groups).forEach(grpName => {
      const tA = groups[grpName].find(x => x.id === m.teamA);
      const tB = groups[grpName].find(x => x.id === m.teamB);
      if (tA && tB) {
        const sA = Number(m.scoreA || m.score1 || 0);
        const sB = Number(m.scoreB || m.score2 || 0);
        tA.played++; tB.played++;
        tA.setsWon += sA; tA.setsLost += sB;
        tB.setsWon += sB; tB.setsLost += sA;
        if (sA > sB) { tA.won++; tA.pts += 2; tB.lost++; }
        else if (sB > sA) { tB.won++; tB.pts += 2; tA.lost++; }
      }
    });
  });

  let html = '';
  Object.keys(groups).sort().forEach(grpName => {
    // Sắp xếp thứ hạng trong bảng
    const sortedTeams = groups[grpName].sort((a, b) => b.pts - a.pts || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost));

    html += `
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div class="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 font-bold text-white text-xs flex items-center justify-between">
          <span>${grpName.toUpperCase()}</span>
          <span class="text-slate-400 font-normal text-[10px]">${sortedTeams.length} đội</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left text-slate-300">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th class="py-2.5 px-3 text-center w-10">#</th>
                <th class="py-2.5 px-3">Đội / VĐV</th>
                <th class="py-2.5 px-3 text-center w-12">Trận</th>
                <th class="py-2.5 px-3 text-center w-12">Thắng</th>
                <th class="py-2.5 px-3 text-center w-12">Thua</th>
                <th class="py-2.5 px-3 text-center w-16">HS Set</th>
                <th class="py-2.5 px-3 text-center w-14 font-bold text-amber-400">Điểm</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${sortedTeams.map((t, idx) => `
                <tr class="hover:bg-slate-800/30">
                  <td class="py-2 px-3 text-center font-mono font-bold ${idx < 2 ? 'text-amber-400' : 'text-slate-400'}">${idx + 1}</td>
                  <td class="py-2 px-3 font-semibold text-white">${t.code ? `<span class="text-cyan-400 font-mono mr-1">[${t.code}]</span>` : ''}${t.name || t.menName}</td>
                  <td class="py-2 px-3 text-center font-mono">${t.played}</td>
                  <td class="py-2 px-3 text-center font-mono text-emerald-400">${t.won}</td>
                  <td class="py-2 px-3 text-center font-mono text-rose-400">${t.lost}</td>
                  <td class="py-2 px-3 text-center font-mono">${t.setsWon - t.setsLost}</td>
                  <td class="py-2 px-3 text-center font-mono text-amber-400 font-bold">${t.pts}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '<div class="text-center py-4 text-slate-500 text-xs">Chưa có bảng đấu nào.</div>';
}

// Hàm render hệ Thụy Sĩ (Swiss View)
function renderSwissView(teams, matches) {
  const tbody = document.getElementById('swiss-table-body');
  if (!tbody) return;

  let standings = [];
  if (window.SwissSystem?.calculateStandings) {
    standings = window.SwissSystem.calculateStandings(teams, matches);
  } else {
    standings = teams.map(t => ({ id: t.id, name: t.name, code: t.code, points: 0, matchesPlayed: 0, setsWon: 0, setsLost: 0 }));
  }

  let html = '';
  standings.forEach((row, idx) => {
    const rank = idx + 1;
    const setDiff = (row.setsWon || 0) - (row.setsLost || 0);
    const losses = (row.matchesPlayed || 0) - (row.points || 0);

    html += `
      <tr class="hover:bg-slate-800/40">
        <td class="py-2.5 px-3 text-center font-bold font-mono ${rank <= 3 ? 'text-amber-400' : 'text-slate-400'}">${rank}</td>
        <td class="py-2.5 px-3 font-semibold text-white">${row.code ? `<span class="text-cyan-400 font-mono mr-1">[${row.code}]</span>` : ''}${row.name}</td>
        <td class="py-2.5 px-3 text-center font-mono">${row.matchesPlayed || 0}</td>
        <td class="py-2.5 px-3 text-center font-mono text-emerald-400">${row.points || 0}</td>
        <td class="py-2.5 px-3 text-center font-mono text-rose-400">${losses >= 0 ? losses : 0}</td>
        <td class="py-2.5 px-3 text-center font-mono text-slate-400">${row.setsWon || 0}-${row.setsLost || 0}</td>
        <td class="py-2.5 px-3 text-center font-mono font-semibold">${setDiff > 0 ? `+${setDiff}` : setDiff}</td>
        <td class="py-2.5 px-3 text-center font-mono text-amber-400 font-extrabold text-sm">${row.points || 0}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

if (typeof window !== 'undefined') {
  window.renderClientStandings = renderClientStandings;
  window.switchStandingsView = switchStandingsView;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderClientStandings);
} else {
  renderClientStandings();
}
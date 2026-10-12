/**
 * =========================================================================
 * COMPONENT CONTROLLER ADMIN: QUẢN LÝ ĐỘI HÌNH & VĐV
 * HỖ TRỢ: ĐÔI NAM, ĐÔI NỮ, ĐÔI NAM NỮ, ĐƠN
 * =========================================================================
 */

function renderAdminTeams() {
  const container = document.getElementById('admin-teams-container');
  if (!container) return;

  const tData = typeof tournamentData !== 'undefined' ? tournamentData : {};
  const teamsObj = tData.teams || {};
  const teams = Object.values(teamsObj);

  if (teams.length === 0) {
    container.innerHTML = `
      <div class="p-8 bg-slate-800/60 rounded-2xl border border-slate-700 text-center text-slate-400 text-xs col-span-2">
        Chưa có cặp đấu nào. Nhấn nút <strong>"Thêm Cặp Đấu Mới"</strong> ở góc trên để bắt đầu!
      </div>
    `;
    return;
  }

  let html = '';
  teams.forEach((team, index) => {
    const teamId = team.id || `T${index + 1}`;
    const code = team.code || `D${index + 1}`;
    const name = team.name || `Đội ${index + 1}`;
    const category = team.category || 'men_doubles'; // men_doubles, women_doubles, mixed_doubles, single
    const player1 = team.player1 || team.menName || '';
    const player2 = team.player2 || team.womenName || '';
    const club = team.club || '';
    const group = team.group || 'A';

    // Nhãn động theo nội dung
    let labelP1 = 'VĐV 1 (Nam)';
    let labelP2 = 'VĐV 2 (Nam)';
    let isSingle = (category === 'single');

    if (category === 'women_doubles') {
      labelP1 = 'VĐV 1 (Nữ)';
      labelP2 = 'VĐV 2 (Nữ)';
    } else if (category === 'mixed_doubles') {
      labelP1 = 'VĐV Nam';
      labelP2 = 'VĐV Nữ';
    } else if (category === 'single') {
      labelP1 = 'Vận Động Viên';
      labelP2 = 'Không áp dụng (Đánh Đơn)';
    }

    html += `
      <div class="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 space-y-3 shadow-md team-card-item" data-team-id="${teamId}">
        <!-- Header thẻ: Mã đội, Tên đội & Nút xóa -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <span class="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono font-bold text-xs shrink-0">
              ${code}
            </span>
            <input type="text" class="input-team-name bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-white font-bold text-xs flex-1 focus:outline-none focus:border-blue-500" value="${name}" placeholder="Tên Cặp đấu / Đội">
          </div>
          <button class="btn-delete-team text-slate-500 hover:text-rose-400 p-1.5 transition text-xs cursor-pointer" data-team-id="${teamId}" title="Xóa cặp đấu này">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <!-- Chọn Nội dung thi đấu & Bảng đấu -->
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="text-[10px] text-slate-400 font-semibold block mb-1">Nội Dung Thi Đấu</label>
            <select class="select-team-category w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500">
              <option value="men_doubles" ${category === 'men_doubles' ? 'selected' : ''}>🏸 Đôi Nam</option>
              <option value="women_doubles" ${category === 'women_doubles' ? 'selected' : ''}>🏸 Đôi Nữ</option>
              <option value="mixed_doubles" ${category === 'mixed_doubles' ? 'selected' : ''}>🏸 Đôi Nam Nữ</option>
              <option value="single" ${category === 'single' ? 'selected' : ''}>👤 Đơn</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] text-slate-400 font-semibold block mb-1">Bảng Đấu (nếu chia bảng)</label>
            <select class="select-team-group w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none focus:border-blue-500">
              <option value="A" ${group === 'A' ? 'selected' : ''}>Bảng A</option>
              <option value="B" ${group === 'B' ? 'selected' : ''}>Bảng B</option>
              <option value="C" ${group === 'C' ? 'selected' : ''}>Bảng C</option>
              <option value="D" ${group === 'D' ? 'selected' : ''}>Bảng D</option>
            </select>
          </div>
        </div>

        <!-- Chi tiết VĐV -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label class="label-p1 text-[10px] text-slate-400 font-semibold block mb-1">${labelP1}</label>
            <input type="text" class="input-team-p1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500" value="${player1}" placeholder="Họ tên vận động viên 1">
          </div>
          <div>
            <label class="label-p2 text-[10px] text-slate-400 font-semibold block mb-1">${labelP2}</label>
            <input type="text" class="input-team-p2 w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500 ${isSingle ? 'opacity-40 cursor-not-allowed' : ''}" value="${player2}" placeholder="Họ tên vận động viên 2" ${isSingle ? 'disabled' : ''}>
          </div>
        </div>

        <!-- CLB / Đơn vị -->
        <div>
          <label class="text-[10px] text-slate-400 font-semibold block mb-1">CLB / Đơn Vị Đại Diện</label>
          <input type="text" class="input-team-club w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-blue-500" value="${club}" placeholder="Ví dụ: CLB Cầu Lông Tân Bình">
        </div>

        <!-- Nút lưu -->
        <button class="btn-save-team w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-1" data-team-id="${teamId}">
          <i class="fa-solid fa-floppy-disk"></i> Lưu Thông Tin Cặp Đấu
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  // LẮNG NGHE SỰ KIỆN: THAY ĐỔI NỘI DUNG (CATEGORY) TRÊN THẺ
  container.querySelectorAll('.select-team-category').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const card = sel.closest('.team-card-item');
      if (!card) return;
      const cat = e.target.value;
      const label1 = card.querySelector('.label-p1');
      const label2 = card.querySelector('.label-p2');
      const input2 = card.querySelector('.input-team-p2');

      if (cat === 'women_doubles') {
        if (label1) label1.innerText = 'VĐV 1 (Nữ)';
        if (label2) label2.innerText = 'VĐV 2 (Nữ)';
        input2.disabled = false;
        input2.classList.remove('opacity-40', 'cursor-not-allowed');
      } else if (cat === 'mixed_doubles') {
        if (label1) label1.innerText = 'VĐV Nam';
        if (label2) label2.innerText = 'VĐV Nữ';
        input2.disabled = false;
        input2.classList.remove('opacity-40', 'cursor-not-allowed');
      } else if (cat === 'single') {
        if (label1) label1.innerText = 'Vận Động Viên';
        if (label2) label2.innerText = 'Không áp dụng (Đánh Đơn)';
        input2.disabled = true;
        input2.value = '';
        input2.classList.add('opacity-40', 'cursor-not-allowed');
      } else {
        if (label1) label1.innerText = 'VĐV 1 (Nam)';
        if (label2) label2.innerText = 'VĐV 2 (Nam)';
        input2.disabled = false;
        input2.classList.remove('opacity-40', 'cursor-not-allowed');
      }
    });
  });

  // LẮNG NGHE SỰ KIỆN: LƯU THÔNG TIN
  container.querySelectorAll('.btn-save-team').forEach(btn => {
    btn.addEventListener('click', async () => {
      const teamId = btn.dataset.teamId;
      const card = btn.closest('.team-card-item');
      if (!card) return;

      const name = card.querySelector('.input-team-name')?.value.trim();
      const category = card.querySelector('.select-team-category')?.value || 'men_doubles';
      const player1 = card.querySelector('.input-team-p1')?.value.trim();
      const player2 = card.querySelector('.input-team-p2')?.value.trim();
      const club = card.querySelector('.input-team-club')?.value.trim();
      const group = card.querySelector('.select-team-group')?.value || 'A';

      if (!name) {
        alert("Tên cặp đấu không được để trống!");
        return;
      }

      const updateData = {
        name,
        category,
        player1,
        player2,
        menName: category === 'women_doubles' ? '' : player1,
        womenName: category === 'women_doubles' ? player1 : player2,
        club,
        group
      };

      try {
        if (typeof firebase !== 'undefined' && firebase.database) {
          await firebase.database().ref(`teams/${teamId}`).update(updateData);
          if (typeof showToast === 'function') showToast(`✅ Đã lưu: ${name}!`);
          else alert(`Đã cập nhật: ${name}!`);
        } else {
          alert("Lỗi: Không tìm thấy kết nối Firebase Database.");
        }
      } catch (err) {
        alert(`❌ Lỗi cập nhật: ${err.message}`);
      }
    });
  });

  // LẮNG NGHE SỰ KIỆN: XÓA
  container.querySelectorAll('.btn-delete-team').forEach(btn => {
    btn.addEventListener('click', async () => {
      const teamId = btn.dataset.teamId;
      if (!confirm(`Bạn có chắc muốn xóa cặp đấu này khỏi giải?`)) return;

      try {
        if (typeof firebase !== 'undefined' && firebase.database) {
          await firebase.database().ref(`teams/${teamId}`).remove();
          if (typeof showToast === 'function') showToast(`Đã xóa đội.`);
          renderAdminTeams();
        }
      } catch (err) {
        alert(`❌ Lỗi: ${err.message}`);
      }
    });
  });
}

// SỰ KIỆN THÊM CẶP ĐẤU MỚI
function setupAddTeamButton() {
  const btnAdd = document.getElementById('btn-add-new-team');
  if (!btnAdd) return;

  btnAdd.onclick = async () => {
    const tData = typeof tournamentData !== 'undefined' ? tournamentData : {};
    const teams = Object.values(tData.teams || {});
    const nextIndex = teams.length + 1;
    const newTeamId = `T${String(nextIndex).padStart(2, '0')}`;
    const newCode = `D${nextIndex}`;

    const newTeam = {
      id: newTeamId,
      code: newCode,
      name: `Cặp đấu ${nextIndex}`,
      category: 'men_doubles',
      player1: '',
      player2: '',
      club: '',
      group: 'A'
    };

    try {
      if (typeof firebase !== 'undefined' && firebase.database) {
        await firebase.database().ref(`teams/${newTeamId}`).set(newTeam);
        if (typeof showToast === 'function') showToast(`Đã tạo Cặp đấu ${nextIndex}!`);
        renderAdminTeams();
      } else {
        alert("Chưa kết nối Firebase để tạo đội mới!");
      }
    } catch (err) {
      alert(`❌ Lỗi: ${err.message}`);
    }
  };
}

function initAdminTeamsComponent() {
  renderAdminTeams();
  setupAddTeamButton();
}

if (typeof window !== 'undefined') {
  window.renderAdminTeams = renderAdminTeams;
  window.initAdminTeamsComponent = initAdminTeamsComponent;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminTeamsComponent);
} else {
  initAdminTeamsComponent();
}
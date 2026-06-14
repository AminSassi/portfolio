(function () {
    let session = null;
    let data = null;

    const $ = (s, p) => (p || document).querySelector(s);
    const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

    // Toast
    function toast(msg, type) {
        const t = $('#toast');
        t.textContent = msg;
        t.className = 'toast show ' + (type || '');
        setTimeout(() => t.className = 'toast', 2500);
    }

    // API helpers
    async function api(url, opts = {}) {
        const headers = { 'Content-Type': 'application/json' };
        if (session) headers['x-admin-session'] = session;
        const res = await fetch(url, { ...opts, headers: { ...headers, ...opts.headers } });
        return res.json();
    }

    // Login
    $('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = $('#loginPassword').value;
        const res = await api('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password: pw })
        });
        if (!res.success) {
            $('#loginError').textContent = res.message;
            $('#loginError').style.display = 'block';
            return;
        }
        session = res.session;
        localStorage.setItem('adminSession', session);
        showDashboard();
    });

    // Logout
    $('#logoutBtn').addEventListener('click', async () => {
        await api('/api/admin/logout', { method: 'POST' });
        session = null;
        localStorage.removeItem('adminSession');
        $('#dashboard').style.display = 'none';
        $('#loginScreen').style.display = 'flex';
    });

    // Check existing session
    async function checkSession() {
        const saved = localStorage.getItem('adminSession');
        if (!saved) return;
        session = saved;
        const res = await api('/api/admin/data');
        if (res.success) {
            showDashboard();
        } else {
            session = null;
            localStorage.removeItem('adminSession');
        }
    }

    async function showDashboard() {
        $('#loginScreen').style.display = 'none';
        $('#dashboard').style.display = 'grid';
        await loadData();
    }

    async function loadData() {
        const res = await api('/api/admin/data');
        if (!res.success) { toast('Failed to load data', 'error'); return; }
        data = res.data;
        renderAll();
    }

    // Tabs
    $$('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            $$('.tab-panel').forEach(p => p.classList.remove('active'));
            $(`#tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // Render all sections
    function renderAll() {
        renderPortfolio();
        renderFeedback();
        renderHero();
        renderAbout();
        renderStats();
        renderYouTube();
        renderSocial();
    }

    // ── Portfolio ──
    function renderPortfolio() {
        const list = $('#portfolioList');
        list.innerHTML = data.portfolio.map(item => {
            const thumb = item.fullVideo ? item.fullVideo.replace('/video/upload/', '/video/upload/w_120,c_fill/').replace(/\.mp4$/, '.jpg') : '';
            return `
            <div class="item-card" data-id="${item.id}">
                <div class="item-thumb">
                    <img src="${thumb}" alt="${item.title.en}">
                </div>
                <div class="item-info">
                    <h4>${item.title.en}</h4>
                    <p>${item.description.en}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-ghost edit-portfolio" data-id="${item.id}">Edit</button>
                    <button class="btn-danger delete-portfolio" data-id="${item.id}">Delete</button>
                </div>
            </div>`;
        }).join('');

        list.querySelectorAll('.delete-portfolio').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this project?')) return;
                await api(`/api/admin/portfolio/${btn.dataset.id}`, { method: 'DELETE' });
                toast('Project deleted');
                await loadData();
            });
        });

        list.querySelectorAll('.edit-portfolio').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = data.portfolio.find(p => p.id === btn.dataset.id);
                openPortfolioModal(item);
            });
        });
    }

    function openPortfolioModal(item) {
        const modal = $('#portfolioModal');
        if (item) {
            $('#portfolioModalTitle').textContent = 'Edit Project';
            $('#portfolioItemId').value = item.id;
            $('#pTitleEn').value = item.title.en;
            $('#pTitleTn').value = item.title.tn;
            $('#pDescEn').value = item.description.en;
            $('#pDescTn').value = item.description.tn;
            $('#pFullVideo').value = item.fullVideo;
        } else {
            $('#portfolioModalTitle').textContent = 'Add Project';
            $('#portfolioItemId').value = '';
            $('#portfolioForm').reset();
        }
        modal.style.display = 'flex';
    }

    $('#addPortfolioBtn').addEventListener('click', () => openPortfolioModal(null));

    $('#portfolioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = $('#portfolioItemId').value;
        const body = {
            title: { en: $('#pTitleEn').value, tn: $('#pTitleTn').value },
            description: { en: $('#pDescEn').value, tn: $('#pDescTn').value },
            fullVideo: $('#pFullVideo').value
        };
        if (id) {
            await api(`/api/admin/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(body) });
            toast('Project updated');
        } else {
            await api('/api/admin/portfolio', { method: 'POST', body: JSON.stringify(body) });
            toast('Project added');
        }
        $('#portfolioModal').style.display = 'none';
        await loadData();
    });

    // ── Feedback ──
    function renderFeedback() {
        const list = $('#feedbackList');
        list.innerHTML = data.feedback.map(item => `
            <div class="item-card" data-id="${item.id}">
                <div class="item-thumb" style="border-radius:50%">
                    <img src="${item.avatar}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h4>${item.name} — ${item.company}</h4>
                    <p>${'★'.repeat(item.stars)}${'☆'.repeat(5 - item.stars)}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-ghost edit-feedback" data-id="${item.id}">Edit</button>
                    <button class="btn-danger delete-feedback" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.delete-feedback').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this feedback?')) return;
                await api(`/api/admin/feedback/${btn.dataset.id}`, { method: 'DELETE' });
                toast('Feedback deleted');
                await loadData();
            });
        });

        list.querySelectorAll('.edit-feedback').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = data.feedback.find(f => f.id === btn.dataset.id);
                openFeedbackModal(item);
            });
        });
    }

    function openFeedbackModal(item) {
        const modal = $('#feedbackModal');
        if (item) {
            $('#feedbackModalTitle').textContent = 'Edit Feedback';
            $('#feedbackItemId').value = item.id;
            $('#fName').value = item.name;
            $('#fCompany').value = item.company;
            $('#fAvatar').value = item.avatar;
            $('#fVoice').value = item.voiceUrl;
            $('#fStars').value = item.stars;
        } else {
            $('#feedbackModalTitle').textContent = 'Add Feedback';
            $('#feedbackItemId').value = '';
            $('#feedbackForm').reset();
        }
        modal.style.display = 'flex';
    }

    $('#addFeedbackBtn').addEventListener('click', () => openFeedbackModal(null));

    $('#feedbackForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = $('#feedbackItemId').value;
        const body = {
            name: $('#fName').value,
            company: $('#fCompany').value,
            avatar: $('#fAvatar').value,
            voiceUrl: $('#fVoice').value,
            stars: parseInt($('#fStars').value)
        };
        if (id) {
            await api(`/api/admin/feedback/${id}`, { method: 'PUT', body: JSON.stringify(body) });
            toast('Feedback updated');
        } else {
            await api('/api/admin/feedback', { method: 'POST', body: JSON.stringify(body) });
            toast('Feedback added');
        }
        $('#feedbackModal').style.display = 'none';
        await loadData();
    });

    // ── Hero ──
    function renderHero() {
        const form = $('#heroForm');
        form.querySelectorAll('[data-field]').forEach(input => {
            const keys = input.dataset.field.split('.');
            let val = data.hero;
            keys.forEach(k => val = val?.[k]);
            input.value = val || '';
        });
    }

    $('#heroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {};
        $('#heroForm').querySelectorAll('[data-field]').forEach(input => {
            const keys = input.dataset.field.split('.');
            if (keys.length === 2) {
                if (!body[keys[0]]) body[keys[0]] = {};
                body[keys[0]][keys[1]] = input.value;
            }
        });
        await api('/api/admin/hero', { method: 'PUT', body: JSON.stringify(body) });
        toast('Hero saved');
        await loadData();
    });

    // ── About ──
    function renderAbout() {
        const form = $('#aboutForm');
        form.querySelectorAll('[data-field]').forEach(input => {
            const keys = input.dataset.field.split('.');
            let val = data.about;
            keys.forEach(k => val = val?.[k]);
            input.value = val || '';
        });
        renderSkills();
    }

    function renderSkills() {
        const editor = $('#skillsEditor');
        editor.innerHTML = data.about.skills.map((s, i) => `
            <div class="sub-card">
                <button type="button" class="remove-btn" data-skill="${i}">&times;</button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Title (EN)</label>
                        <input type="text" class="skill-title-en" value="${s.title.en}" data-idx="${i}">
                    </div>
                    <div class="form-group">
                        <label>Title (TN)</label>
                        <input type="text" class="skill-title-tn" value="${s.title.tn}" data-idx="${i}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Description (EN)</label>
                        <input type="text" class="skill-desc-en" value="${s.description.en}" data-idx="${i}">
                    </div>
                    <div class="form-group">
                        <label>Description (TN)</label>
                        <input type="text" class="skill-desc-tn" value="${s.description.tn}" data-idx="${i}">
                    </div>
                </div>
            </div>
        `).join('');

        editor.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                data.about.skills.splice(parseInt(btn.dataset.skill), 1);
                renderSkills();
            });
        });
    }

    $('#addSkillBtn').addEventListener('click', () => {
        data.about.skills.push({ title: { en: '', tn: '' }, description: { en: '', tn: '' } });
        renderSkills();
    });

    $('#aboutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const paragraphs = [];
        $$('#aboutForm [data-field]').forEach(input => {
            const keys = input.dataset.field.split('.');
            if (keys[0] === 'paragraphs') {
                const idx = parseInt(keys[1]);
                if (!paragraphs[idx]) paragraphs[idx] = {};
                paragraphs[idx][keys[2]] = input.value;
            }
        });
        const skills = data.about.skills.map((_, i) => ({
            title: {
                en: $(`.skill-title-en[data-idx="${i}"]`).value,
                tn: $(`.skill-title-tn[data-idx="${i}"]`).value
            },
            description: {
                en: $(`.skill-desc-en[data-idx="${i}"]`).value,
                tn: $(`.skill-desc-tn[data-idx="${i}"]`).value
            }
        }));
        await api('/api/admin/about', { method: 'PUT', body: JSON.stringify({ paragraphs, skills }) });
        toast('About saved');
        await loadData();
    });

    // ── Stats ──
    function renderStats() {
        const editor = $('#statsEditor');
        editor.innerHTML = data.stats.map((s, i) => `
            <div class="sub-card">
                <button type="button" class="remove-btn" data-stat="${i}">&times;</button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Number (EN)</label>
                        <input type="text" class="stat-num-en" value="${s.number.en}" data-idx="${i}">
                    </div>
                    <div class="form-group">
                        <label>Number (TN)</label>
                        <input type="text" class="stat-num-tn" value="${s.number.tn}" data-idx="${i}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Label (EN)</label>
                        <input type="text" class="stat-label-en" value="${s.label.en}" data-idx="${i}">
                    </div>
                    <div class="form-group">
                        <label>Label (TN)</label>
                        <input type="text" class="stat-label-tn" value="${s.label.tn}" data-idx="${i}">
                    </div>
                </div>
            </div>
        `).join('');

        editor.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                data.stats.splice(parseInt(btn.dataset.stat), 1);
                renderStats();
            });
        });
    }

    $('#addStatBtn').addEventListener('click', () => {
        data.stats.push({ number: { en: '', tn: '' }, label: { en: '', tn: '' } });
        renderStats();
    });

    $('#statsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const stats = data.stats.map((_, i) => ({
            number: {
                en: $(`.stat-num-en[data-idx="${i}"]`).value,
                tn: $(`.stat-num-tn[data-idx="${i}"]`).value
            },
            label: {
                en: $(`.stat-label-en[data-idx="${i}"]`).value,
                tn: $(`.stat-label-tn[data-idx="${i}"]`).value
            }
        }));
        await api('/api/admin/stats', { method: 'PUT', body: JSON.stringify({ stats }) });
        toast('Stats saved');
        await loadData();
    });

    // ── YouTube ──
    function renderYouTube() {
        const form = $('#youtubeForm');
        form.querySelectorAll('[data-field]').forEach(input => {
            const keys = input.dataset.field.split('.');
            let val = data.youtube;
            keys.forEach(k => val = val?.[k]);
            input.value = val || '';
        });
    }

    $('#youtubeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {};
        $('#youtubeForm').querySelectorAll('[data-field]').forEach(input => {
            const keys = input.dataset.field.split('.');
            if (keys.length === 2) {
                if (!body[keys[0]]) body[keys[0]] = {};
                body[keys[0]][keys[1]] = input.value;
            } else {
                body[keys[0]] = input.value;
            }
        });
        await api('/api/admin/youtube', { method: 'PUT', body: JSON.stringify(body) });
        toast('YouTube saved');
        await loadData();
    });

    // ── Social ──
    function renderSocial() {
        const editor = $('#socialEditor');
        editor.innerHTML = data.social.map((s, i) => `
            <div class="sub-card">
                <button type="button" class="remove-btn" data-social="${i}">&times;</button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Platform</label>
                        <select class="social-platform" data-idx="${i}">
                            <option value="instagram" ${s.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="linkedin" ${s.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                            <option value="facebook" ${s.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                            <option value="youtube" ${s.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                            <option value="twitter" ${s.platform === 'twitter' ? 'selected' : ''}>Twitter/X</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>URL</label>
                        <input type="url" class="social-url" value="${s.url}" data-idx="${i}">
                    </div>
                </div>
            </div>
        `).join('');

        editor.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                data.social.splice(parseInt(btn.dataset.social), 1);
                renderSocial();
            });
        });
    }

    $('#addSocialBtn').addEventListener('click', () => {
        data.social.push({ platform: 'instagram', url: '' });
        renderSocial();
    });

    $('#socialForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const social = data.social.map((_, i) => ({
            platform: $(`.social-platform[data-idx="${i}"]`).value,
            url: $(`.social-url[data-idx="${i}"]`).value
        }));
        await api('/api/admin/social', { method: 'PUT', body: JSON.stringify({ social }) });
        toast('Social links saved');
        await loadData();
    });

    // ── Modal close ──
    $$('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            $(`#${btn.dataset.close}`).style.display = 'none';
        });
    });

    $$('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    // Init
    checkSession();
})();

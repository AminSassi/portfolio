(function () {
    const REPO = 'AminSassi/portfolio';
    const FILE_PATH = 'data.json';
    const API_BASE = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

    let token = null;
    let data = null;
    let fileSHA = null;

    const $ = (s, p) => (p || document).querySelector(s);
    const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

    function toast(msg, type) {
        const t = $('#toast');
        t.textContent = msg;
        t.className = 'toast show ' + (type || '');
        setTimeout(() => t.className = 'toast', 2500);
    }

    async function ghFetch(url, opts = {}) {
        const headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...opts.headers
        };
        const res = await fetch(url, { ...opts, headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `GitHub API error ${res.status}`);
        }
        return res.json();
    }

    async function loadData() {
        const res = await ghFetch(API_BASE);
        fileSHA = res.sha;
        const content = decodeURIComponent(escape(atob(res.content)));
        data = JSON.parse(content);
        return data;
    }

    async function saveData(commitMsg) {
        const body = JSON.stringify(data, null, 2);
        const encoded = btoa(unescape(encodeURIComponent(body)));
        await ghFetch(API_BASE, {
            method: 'PUT',
            body: JSON.stringify({
                message: commitMsg,
                content: encoded,
                sha: fileSHA
            })
        });
        // Re-fetch to get new SHA
        const res = await ghFetch(API_BASE);
        fileSHA = res.sha;
    }

    // Login
    $('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = $('#githubToken').value.trim();
        if (!input) return;
        token = input;
        try {
            await loadData();
            localStorage.setItem('ghToken', token);
            showDashboard();
        } catch (err) {
            $('#loginError').textContent = 'Invalid token or repo access: ' + err.message;
            $('#loginError').style.display = 'block';
            token = null;
        }
    });

    $('#logoutBtn').addEventListener('click', () => {
        token = null;
        localStorage.removeItem('ghToken');
        $('#dashboard').style.display = 'none';
        $('#loginScreen').style.display = 'flex';
    });

    async function checkSession() {
        const saved = localStorage.getItem('ghToken');
        if (!saved) return;
        token = saved;
        try {
            await loadData();
            showDashboard();
        } catch {
            token = null;
            localStorage.removeItem('ghToken');
        }
    }

    function showDashboard() {
        $('#loginScreen').style.display = 'none';
        $('#dashboard').style.display = 'grid';
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
                data.portfolio = data.portfolio.filter(p => p.id !== btn.dataset.id);
                await saveData('Delete portfolio project');
                toast('Project deleted');
                renderAll();
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
            const idx = data.portfolio.findIndex(p => p.id === id);
            data.portfolio[idx] = { ...data.portfolio[idx], ...body };
            await saveData('Update portfolio project');
            toast('Project updated');
        } else {
            body.id = 'p' + Date.now();
            data.portfolio.push(body);
            await saveData('Add portfolio project');
            toast('Project added');
        }
        $('#portfolioModal').style.display = 'none';
        renderAll();
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
                data.feedback = data.feedback.filter(f => f.id !== btn.dataset.id);
                await saveData('Delete feedback');
                toast('Feedback deleted');
                renderAll();
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
            const idx = data.feedback.findIndex(f => f.id === id);
            data.feedback[idx] = { ...data.feedback[idx], ...body };
            await saveData('Update feedback');
            toast('Feedback updated');
        } else {
            body.id = 'f' + Date.now();
            data.feedback.push(body);
            await saveData('Add feedback');
            toast('Feedback added');
        }
        $('#feedbackModal').style.display = 'none';
        renderAll();
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
        data.hero = { ...data.hero, ...body };
        await saveData('Update hero section');
        toast('Hero saved');
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
        data.about = { paragraphs, skills };
        await saveData('Update about section');
        toast('About saved');
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
        data.stats = stats;
        await saveData('Update stats section');
        toast('Stats saved');
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
        data.youtube = { ...data.youtube, ...body };
        await saveData('Update youtube section');
        toast('YouTube saved');
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
        data.social = social;
        await saveData('Update social links');
        toast('Social links saved');
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

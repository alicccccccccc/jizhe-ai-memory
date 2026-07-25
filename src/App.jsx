import { useEffect, useRef, useState } from "react";
import LiquidChrome from "./LiquidChrome";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navItems = [
  { href: "#profile", id: "profile", label: "角色档案" },
  { href: "#projects", id: "projects", label: "任务作品" },
  { href: "#strengths", id: "strengths", label: "能力卡组" },
  { href: "#contact", id: "contact", label: "终章" },
];

const contactLinks = [
  { label: "Phone", value: "18128632583", href: "tel:18128632583" },
  { label: "Email", value: "alicccccc@qq.com", href: "mailto:alicccccc@qq.com" },
  { label: "GitHub", value: "github.com/aliccccccccc", href: "https://github.com/aliccccccccc" },
];

const stats = [
  { value: "40", label: "Product", note: "AI 产品 0 到 1" },
  { value: "40", label: "Business", note: "业务 SOP 拆解" },
  { value: "20", label: "Data", note: "归因与调优" },
];

const experiences = [
  {
    time: "2026.02 - 2026.07",
    title: "AI 产品助理（B 端信贷）",
    place: "深圳市小融信息技术有限公司",
    text: "拆解银行信贷全链路 SOP，结合 SQL 归因与用户访谈定位高流失节点，推动 5 项优化进入迭代排期。",
  },
  {
    time: "2025.11 - 2026.02",
    title: "软件测试",
    place: "深圳尚学汇智教育科技有限公司",
    text: "负责题库、考试、阅卷、成绩分析模块测试，编写 300+ 条用例，并输出 10+ 项产品改进建议。",
  },
  {
    time: "2022.09 - 2026.06",
    title: "计算机科学与技术 本科",
    place: "广州新华学院",
    text: "GPA 专业前 20%，持续学习 AI 产品、RAG、Agent 工作流、Prompt Engineering 与产品数据分析。",
  },
];

const projects = [
  {
    id: "mission-01",
    name: "记着 JiZhe",
    role: "本地优先个人记忆搜索引擎 / V1.1",
    version: "PRD V1.1 · 2026.07.25",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85",
    summary: "面向学生、知识工作者和创作者，设计一个可保存文字、截图和资料图片的个人记忆系统。AI 负责理解内容并生成标题、摘要、标签、结构化字段和可搜索内容，回答必须来自用户自己的记忆来源。",
    details: ["本地 AI 代理", "多模态图片识别", "加权本地搜索", "问答引用来源", "JSON 备份"],
    flow: ["保存文字/图片", "AI 理解", "本地存储", "加权检索", "问答引用"],
    brief: [
      { label: "Goal", value: "保存 -> 理解 -> 检索 -> 回答 -> 引用" },
      { label: "AI Part", value: "文本提取 + 多模态识别 + 来源约束回答" },
      { label: "PM Part", value: "PRD、原型、验收标准、错误兜底" },
    ],
    evidence: [
      { title: "产品定位", text: "本地优先，不做云同步和协作，把保存成本、可信检索和来源引用作为 MVP 核心。" },
      { title: "关键链路", text: "文字或图片进入系统后，生成结构化记忆，再通过标题、标签、分类、摘要、字段和全文进行带权重召回。" },
      { title: "可信问答", text: "疑问句触发问答，召回前 6 条记忆，答案只基于召回内容生成，并展示可点击来源卡片。" },
      { title: "异常设计", text: "AI 失败不阻断保存；图片识别失败展示真实错误，支持重试或手动关键词兜底。" },
    ],
  },
];
const strengths = [
  { title: "AI 产品 0 到 1", level: "Applied", use: "早期产品闭环", text: "从需求发现、原型、PRD 到迭代推进，能把模糊想法变成可交付计划。" },
  { title: "RAG / Agent 产品化", level: "Applied", use: "JiZhe 记忆检索", text: "关注检索质量、上下文管理、幻觉治理与结构化输出约束。" },
  { title: "业务 SOP 拆解", level: "Strong", use: "B 端信贷流程", text: "把复杂审批流、状态流转和用户路径拆成清晰的产品规则。" },
  { title: "用户研究", level: "Strong", use: "12+ 场访谈", text: "通过访谈、角色模拟和行为观察，把用户痛点变成产品判断。" },
  { title: "数据归因", level: "Applied", use: "SQL / A/B Test", text: "用 SQL、A/B 测试和行为数据验证体验问题，推动决策更具体。" },
  { title: "跨团队推进", level: "Reliable", use: "评审与站会", text: "参与评审、站会和协作沟通，让设计、前端、后端围绕同一目标前进。" },
];

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const pointer = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let stars = [];
    let frame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(120, Math.floor(width / 13)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.9 + 0.1,
        size: Math.random() * 1.25 + 0.2,
        speed: Math.random() * 0.12 + 0.025,
      }));
    };

    const move = (event) => {
      pointer.x = (event.clientX / width - 0.5) * 18;
      pointer.y = (event.clientY / height - 0.5) * 18;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,0.78)";
      stars.forEach((star) => {
        star.y += star.speed + star.z * 0.08;
        star.x += pointer.x * star.z * 0.012;
        if (star.y > height + 10) star.y = -10;
        if (star.x > width + 10) star.x = -10;
        if (star.x < -10) star.x = width + 10;
        const pulse = Math.sin(frame * 0.018 + star.x) * 0.35 + 0.65;
        context.globalAlpha = pulse * star.z;
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      frame += 1;
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);

  
  return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas className="starfield" ref={canvasRef} aria-hidden="true" />;
}

function RobotAvatar() {
  return (
    <aside className="avatar-frame" aria-label="Empty profile visual panel">
      <div className="portrait-card empty-visual-panel liquid-visual-panel">
        <LiquidChrome
          baseColor={[0.78, 0.08, 0.08]}
          speed={0.26}
          amplitude={0.34}
          frequencyX={2.8}
          frequencyY={2.2}
          interactive={true}
        />
        <div className="core-overlay">
          <span>AI CORE</span>
          <strong>RAG / Agent / Prompt / Data</strong>
          <div className="core-tags"><em>RAG</em><em>Agent</em><em>Prompt</em><em>Research</em></div>
        </div>
        <div className="portrait-scan" />
      </div>
      <div className="hud-note">AI core reactor</div>
    </aside>
  );
}
function App() {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [navFloating, setNavFloating] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setNavFloating(scrollY > window.innerHeight * 0.82);

      const sections = ["profile", "projects", "strengths", "contact"];
      const current = sections.findLast((id) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top <= window.innerHeight * 0.42 : false;
      });
      setActiveSection(current || "top");
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const ease = "power4.out";

      gsap.set([".brand", ".nav-links a", ".contact-button"], { autoAlpha: 0, y: -22 });
      gsap.set(".system-line", { autoAlpha: 0, y: 32, letterSpacing: "0.34em" });
      gsap.set(".hero h1 span", { autoAlpha: 0, yPercent: 96, scaleY: 0.55, transformOrigin: "50% 100%", clipPath: "inset(0 0 100% 0)" });
      gsap.set(".hero h1 strong", { autoAlpha: 0, yPercent: 86, scaleY: 0.48, transformOrigin: "50% 100%", clipPath: "inset(100% 0 0 0)" });
      gsap.set([".hero-pronunciation", ".role-list li", ".hero-text", ".signal-strip", ".hero-actions a"], { autoAlpha: 0, y: 34 });
      gsap.set(".avatar-frame", { autoAlpha: 0, x: 120, rotate: 4, scale: 0.92, filter: "blur(10px)" });
      gsap.set(".portrait-card", { clipPath: "inset(0 0 100% 0)", scaleY: 1.08, transformOrigin: "50% 100%" });
      gsap.set(".hero-scrim", { autoAlpha: 0.35 });

      const opening = gsap.timeline({ defaults: { ease } });
      opening
        .to(".hero-scrim", { autoAlpha: 1, duration: 0.8 }, 0)
        .to([".brand", ".nav-links a", ".contact-button"], { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.055 }, 0.12)
        .to(".system-line", { autoAlpha: 1, y: 0, letterSpacing: "0.18em", duration: 0.9 }, 0.32)
        .to(".hero h1 span", { autoAlpha: 1, yPercent: 0, scaleY: 1, clipPath: "inset(0% 0 0% 0)", duration: 1.18 }, 0.48)
        .to(".hero h1 strong", { autoAlpha: 1, yPercent: 0, scaleY: 1, clipPath: "inset(0% 0 0% 0)", duration: 1.22 }, 0.64)
        .to(".avatar-frame", { autoAlpha: 1, x: 0, rotate: 0.7, scale: 1, filter: "blur(0px)", duration: 1.1 }, 0.78)
        .to(".portrait-card", { clipPath: "inset(0% 0 0% 0)", scaleY: 1, duration: 1.05 }, 0.86)
        .to(".hero-pronunciation", { autoAlpha: 1, y: 0, duration: 0.86 }, 0.96)
        .to(".role-list li", { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 }, 1.08)
        .to([".hero-text", ".signal-strip", ".hero-actions a"], { autoAlpha: 1, y: 0, duration: 0.76, stagger: 0.08 }, 1.28);

      gsap.utils.toArray(".profile-section, .projects-section, .strengths-section").forEach((section) => {
        const label = section.querySelector(".section-heading span");
        const heading = section.querySelector(".section-heading h2");
        const intro = section.querySelector(".section-heading p");
        const cards = section.querySelectorAll(".bio-panel, .stats-panel, .timeline-panel, .mission-card, .mission-detail, .strength-card");

        gsap.set([label, heading, intro], { autoAlpha: 0 });
        gsap.set(label, { x: -180, scaleX: 0.62, transformOrigin: "0% 50%", filter: "blur(8px)" });
        gsap.set(heading, { y: 72, scaleY: 0.68, transformOrigin: "0% 100%", clipPath: "inset(100% 0 0 0)" });
        gsap.set(intro, { y: 26 });
        gsap.set(cards, { autoAlpha: 0, y: 80, scale: 0.965, clipPath: "inset(16% 0 0 0)" });

        const sectionTl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            once: true,
          },
        });

        sectionTl
          .to(label, { autoAlpha: 1, x: 0, scaleX: 1, filter: "blur(0px)", duration: 1.05 })
          .to(heading, { autoAlpha: 1, y: 0, scaleY: 1, clipPath: "inset(0% 0 0 0)", duration: 0.95 }, "-=0.7")
          .to(intro, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.42")
          .to(cards, { autoAlpha: 1, y: 0, scale: 1, clipPath: "inset(0% 0 0 0)", duration: 0.9, stagger: 0.09 }, "-=0.28");
      });

      gsap.set(".mission-image", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".mission-image img", { scale: 1.16, yPercent: -8 });
      gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: ".mission-detail",
          start: "top 72%",
          once: true,
        },
      })
        .to(".mission-image", { clipPath: "inset(0 0% 0 0)", duration: 1.05 })
        .to(".mission-image img", { scale: 1.04, duration: 1.2 }, "-=0.9");

      gsap.to(".mission-image img", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      const closingTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: ".closing-section",
          start: "top 70%",
          once: true,
        },
      });
      gsap.set([".ending-panel > span", ".ending-panel h2", ".ending-panel p", ".ending-status", ".closing-actions a"], { autoAlpha: 0 });
      gsap.set(".ending-panel h2", { y: 80, scaleY: 0.68, clipPath: "inset(100% 0 0 0)", transformOrigin: "50% 100%" });
      gsap.set([".ending-panel > span", ".ending-panel p", ".ending-status", ".closing-actions a"], { y: 34 });
      closingTl
        .to(".ending-panel > span", { autoAlpha: 1, y: 0, duration: 0.72 })
        .to(".ending-panel h2", { autoAlpha: 1, y: 0, scaleY: 1, clipPath: "inset(0% 0 0 0)", duration: 1.05 }, "-=0.36")
        .to([".ending-panel p", ".ending-status", ".closing-actions a"], { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.09 }, "-=0.34");

      ScrollTrigger.refresh();
    });

    return () => context.revert();
  }, []);
  return (
    <div className="site-shell">
      <Starfield />

      <header className="hero" id="top">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-scrim" />

        <nav className={navFloating ? "nav frame nav-floating" : "nav frame"} aria-label="Primary navigation">
          <a className="brand" href="#top">
            <span>LGH</span>
            <small>AI Product Assistant</small>
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <a className={activeSection === item.id ? "active" : ""} href={item.href} key={item.id}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="contact-button" href="mailto:alicccccc@qq.com">建立联系</a>
        </nav>

        <div className="hero-inner frame">
          <div className="hero-copy-block">
            <p className="system-line">AI PRODUCT ASSISTANT / 2026</p>
            <h1><span>李国豪</span><strong>AI 产品助理</strong></h1>
            <p className="hero-pronunciation">PRODUCT SENSE / RAG WORKFLOW / DATA INSIGHT / DELIVERY</p>
            <ul className="role-list" aria-label="Role keywords">
              <li>Product Research</li>
              <li>RAG Workflow</li>
              <li>Prompt Design</li>
              <li>Data Attribution</li>
            </ul>
            <p className="hero-text">把复杂业务、AI 能力和用户体验拆成可以交付的产品路径。</p>
            <div className="signal-strip" aria-label="Portfolio status">
              <span>STATUS: SEEKING AI PRODUCT ROLE</span>
              <span>MODE: INTERVIEW READY</span>
              <span>BUILD: 2026</span>
            </div>
            <div className="hero-actions">
              <a className="primary-link" href="#projects">进入作品任务</a>
              <a className="secondary-link" href="#profile">查看角色档案</a>
            </div>
          </div>

          <RobotAvatar />

        </div>
      </header>

      <main className="lower-stage">
        <div className="lower-liquid-bg" aria-hidden="true" />
        <section className="profile-section frame" id="profile">
          <div className="section-heading">
            <span>ROLE DOSSIER</span>
            <h2>角色档案卡</h2>
            <p>把简历信息收束成身份、属性和时间线三个区域，让招聘方快速判断我能承担什么产品工作。</p>
          </div>

          <div className="profile-grid">
            <div className="bio-panel">
              <span className="panel-label">PLAYER PROFILE</span>
              <h3>Identity / AI 产品助理</h3>
              <p>计算机科学与技术本科，GPA 专业前 20%。定位是 AI 产品助理，擅长把技术能力、业务规则和用户问题拆成可推进的产品方案。</p>
              <div className="contact-grid">
                {contactLinks.map((item) => (
                  <a href={item.href} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </a>
                ))}
              </div>
            </div>

            <div className="stats-panel">
              {stats.map((item) => (
                <div className="stat-cell" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </div>
              ))}
            </div>

            <div className="timeline-panel">
              <div className="timeline-header">
                <span>EXPERIENCE LOG</span>
                <strong>从业务流程到 AI 产品落地</strong>
              </div>
              {experiences.map((item) => (
                <article key={`${item.time}-${item.title}`}>
                  <time>{item.time}</time>
                  <div>
                    <h3>{item.title}</h3>
                    <strong>{item.place}</strong>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="projects-section frame" id="projects">
          <div className="section-heading wide">
            <span>MISSION SELECT</span>
            <h2>任务作品集</h2>
            <p>这部分根据最新 PRD 迭代，展示我如何把一个 AI 产品从问题定义、功能边界、信息架构、异常兜底到验收标准完整拆出来。</p>
          </div>

          <div className="mission-board">
            <div className="mission-list">
              {projects.map((project) => (
                <button
                  className={project.id === activeProject.id ? "mission-card active" : "mission-card"}
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  type="button"
                >
                  <span>{project.id}</span>
                  <strong>{project.name}</strong>
                  <small>{project.role}</small>
                </button>
              ))}
            </div>

            <article className="mission-detail">
              <div className="mission-image">
                <img src={activeProject.image} alt={`${activeProject.name} 项目展示图`} />
                <div className="mission-image-hud">
                  <span>Selected Mission</span>
                  <strong>{activeProject.id}</strong>
                </div>
              </div>
              <div className="mission-copy">
                <span>{activeProject.role}</span>
                <h3>{activeProject.name}</h3>
                <p>{activeProject.summary}</p>
                <div className="mission-brief">
                  <div><span>Goal</span><strong>个人记忆检索闭环</strong></div>
                  <div><span>AI Part</span><strong>RAG + Copilot</strong></div>
                  <div><span>PM Part</span><strong>需求拆解与路径设计</strong></div>
                </div>
                <div className="mission-flow">
                  {activeProject.flow.map((step) => <span key={step}>{step}</span>)}
                </div>
                <div className="project-evidence">
                  {activeProject.evidence.map((item) => (
                    <article key={item.title}>
                      <span>{item.title}</span>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
                <div className="tag-row">
                  {activeProject.details.map((detail) => <em key={detail}>{detail}</em>)}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="strengths-section frame" id="strengths">
          <div className="section-heading">
            <span>SKILL CARDS</span>
            <h2>能力卡组</h2>
            <p>每张卡都对应真实项目场景，展示的不只是关键词，而是我可以上手承担的工作。</p>
          </div>

          <div className="strength-grid">
            {strengths.map((item, index) => (
              <article className="strength-card" key={item.title} style={{ "--delay": `${index * 70}ms` }}>
                <small>card {String(index + 1).padStart(2, "0")}</small>
                <h3>{item.title}</h3>
                <div className="card-meta"><span>Level: {item.level}</span><span>Use: {item.use}</span></div>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="closing-section" id="contact">
        <div className="ending-panel frame">
          <span>RESULT SCREEN</span>
          <h2>有幸展示个人作品，感谢各位悉心观看，恳请多多指教。</h2>
          <p>THANKS FOR WATCHING / 李国豪 / AI 产品助理</p>
          <div className="ending-status">
            <span>Next action</span>
            <strong>期待一次面对面的产品讨论</strong>
          </div>
          <div className="closing-actions">
            <a className="primary-link" href="mailto:alicccccc@qq.com">发送邮件</a>
            <a className="secondary-link" href="https://github.com/aliccccccccc">查看 GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;













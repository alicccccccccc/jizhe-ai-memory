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
  { label: "Phone", value: "13352836083", href: "tel:13352836083" },
  { label: "Email", value: "alicccccc@qq.com", href: "mailto:alicccccc@qq.com" },
  { label: "GitHub", value: "github.com/alicccccccccc", href: "https://github.com/alicccccccccc" },
];

const experiences = [
  {
    time: "2026.08 – 至今",
    title: "AI 产品经理",
    place: "邱震海文化信息咨询有限公司",
    points: [
      { label: "AI工作流与交付规范", text: "使用 Codex 将长篇逐字稿处理、内容整理、页面排版、HTML / PDF 导出和结果检查串成可复用的 AI 工作流，并通过 Codex Skill 固化操作步骤；增加内容完整性检查和异常反馈，降低长文本处理中的遗漏与格式问题。" },
      { label: "竞品分析与业务判断", text: "围绕企业出海及相关课程开展竞品研究，梳理课程定位、内容结构与呈现方式，为课程体系调整和产品详情页设计提供依据。" },
      { label: "AI辅助小程序设计与开发", text: "使用 Codex + MCP 推进企业增长潜力测评和跨年活动选座两款小程序，从需求拆解、页面交互到功能实现和联调；结合 CloudBase 云函数支持测评提交、报告查看、企微通知、选座预约及运营后台等基础流程，并完成基础测试。" },
      { label: "课程体系搭建与协同管理", text: "参与课程框架梳理、内容结构优化及配套资料整理，协同维护讲师与合作信息；对尚未确认的商业条件进行标记和跟进，支持课程方案持续完善。" },
    ],
  },
  {
    time: "2026.02 – 2026.07",
    title: "AI 产品助理（B 端信贷方向）",
    place: "深圳市小融信息技术有限公司",
    points: [
      { label: "流程与需求", text: "参与银行信贷流程梳理与 PRD 整理，输出流程说明和需求文档。" },
      { label: "研究与验证", text: "通过 8+ 场用户访谈归纳 30+ 条痛点，推动 5 项优化进入排期；基于 SQL 分析申请流失，方案采纳后申请完成率提升约 15%。" },
    ],
  },
  {
    time: "2025.11 – 2026.02",
    title: "测试",
    place: "深圳尚学汇智教育科技有限公司",
    points: [
      { label: "质量与体验", text: "验证题库、考试、阅卷和成绩分析模块，编写 300+ 条测试用例，提出 10+ 项体验优化建议。" },
    ],
  },
  {
    time: "2022.09 – 2026.06",
    title: "计算机科学与技术 本科",
    place: "广州新华学院",
    points: [
      { label: "教育背景", text: "GPA 专业前 20%。计算机本科背景，聚焦 AI 应用产品、需求拆解与产品落地。" },
    ],
  },
];

const projects = [
  {
    id: "mission-02",
    name: "Prompt 菜市场",
    role: "职业 AI 角色与任务工作台",
    date: "2026.10",
    image: "./prompt-market-demo.jpg",
    imageAlt: "Prompt 菜市场实际界面：互动网格、卡通角色与职业分类筛选",
    demo: "https://prompt-market-3zx.pages.dev/",
    caseStudy: "./prompt-market.html",
    demoNote: "已上线。可搜索、收藏、填写任务与导出 Codex 技能包；模型运行使用用户自己的 AI 工具。",
    summary: "独立完成 Prompt 菜市场的产品设计、交互设计、前端开发与上线部署。围绕查找职业角色和完成实际任务，设计角色分类、卡通角色卡和任务工作台，支持搜索收藏、提示词预览与 Codex 技能包导出。",
    details: ["React", "Vite", "Cloudflare Pages", "Codex 技能包"],
    flow: ["查找角色", "填写任务", "预览提示词", "复制或导出", "在 AI 工具中使用"],
    brief: [
      { label: "产品目标", value: "让用户按具体任务找到、填写并复用角色方法" },
      { label: "核心设计", value: "角色卡片、任务组合器与 Codex 文件导出" },
      { label: "独立负责", value: "产品设计、交互设计、前端开发与上线部署" },
    ],
    evidence: [
      { title: "信息架构", text: "按职业与工作场景组织角色，设计分类筛选、关键词搜索与任务示例，帮助用户判断角色是否适合当前任务。" },
      { title: "交互设计", text: "设计卡通角色卡、收藏与菜篮，让角色浏览、选择和批量带走形成连续操作流程。" },
      { title: "任务工作台", text: "将任务输入拆为目标、背景和输出要求，提供示例填充、提示词预览、复制及 Markdown 与 Codex 技能包导出。" },
      { title: "开发与交付", text: "使用 React 与 Vite 完成前端开发，接入浏览器本地存储，适配桌面与手机，并部署至 Cloudflare Pages。" },
    ],
  },
  {
    id: "mission-01",
    name: "记着 JiZhe",
    role: "AI 个人记忆检索系统",
    date: "2026.06",
    image: "./jizhe-demo.jpg",
    demo: "https://jizhe-memory-demo.pages.dev/",
    demoNote: "当前公开演示支持文字保存与检索；AI 问答和图片理解尚未接入服务。",
    summary: "面向学生、知识工作者和创作者，设计一个可保存文字、截图和资料图片的个人记忆系统。AI 负责理解内容并生成标题、摘要、标签、结构化字段和可搜索内容，回答必须来自用户自己的记忆来源。",
    details: ["React", "GPT 多模态识别", "Cloudflare Pages Functions", "PWA"],
    flow: ["保存文字/图片", "AI 理解", "本地存储", "加权检索", "问答引用"],
    brief: [
      { label: "产品目标", value: "让保存过的资料可检索、可引用" },
      { label: "AI 设计", value: "截图理解、结构化信息与来源约束问答" },
      { label: "独立负责", value: "需求分析、产品设计、开发与部署" },
    ],
    evidence: [
      { title: "产品定位", text: "本地优先，不做云同步和协作，把保存成本、可信检索和来源引用作为 MVP 核心。" },
      { title: "关键链路", text: "文字或图片进入系统后，生成结构化记忆，再通过标题、标签、分类、摘要、字段和全文进行带权重召回。" },
      { title: "可信问答", text: "疑问句触发问答，召回前 6 条记忆，答案只基于召回内容生成，并展示可点击来源卡片。" },
      { title: "异常与安全", text: "AI 失败不阻断保存，支持重试或手动关键词兜底；通过后端代理保护 API Key，不在前端暴露服务密钥。" },
    ],
  },
];
const strengths = [
  { title: "AI 工作流设计", use: "Codex Skill / 自动校验", text: "把逐字稿解析、HTML/PDF 渲染和脚本校验封装为可复用流程，关注结果质量与异常拦截。" },
  { title: "可信 AI 应用", use: "Prompt / Memory / RAG", text: "设计结构化输出、多模态识别与来源引用，处理识别失败、降级兜底和密钥安全。" },
  { title: "MVP 开发与云部署", use: "Codex + MCP / CloudBase", text: "推进页面实现与接口联调，使用 React、Next.js、Supabase、CloudBase 和 Cloudflare Pages 完成功能落地。" },
  { title: "业务流程与产品规则", use: "信贷流程 / 选座状态", text: "拆解业务 SOP、交互状态和后台管理需求，以流程说明、PRD 与原型支持交付。" },
  { title: "用户研究与数据分析", use: "8+ 场访谈 / SQL", text: "通过访谈归纳痛点，以 SQL 分析申请流失，将问题转化为可进入排期的优化建议。" },
  { title: "产品设计与协同", use: "Figma / Axure / ChatGPT / DeepSeek", text: "结合竞品研究、信息架构与产品原型推进需求沟通，参与课程产品化及运营后台设计。" },
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
        const cards = section.querySelectorAll(".bio-panel, .timeline-panel, .mission-card, .mission-detail, .strength-card");

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

  useEffect(() => {
    const section = navItems.find((item) => item.href === window.location.hash);
    if (!section) return undefined;

    // React mounts the sections after the browser's initial fragment navigation.
    const frame = requestAnimationFrame(() => {
      document.getElementById(section.id)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="site-shell">
      <Starfield />

      <header className="hero" id="top">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-scrim" />

        <div className="nav-slot">
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
        </div>

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
            <p className="hero-text">聚焦 AI 应用，从需求拆解、工作流设计到 MVP 开发与云部署，让产品走到可用的那一步。</p>
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
            <p>计算机本科背景，参与 AI 工作流、小程序与 B 端业务建设，关注产品从需求到上线的完整过程。</p>
          </div>

          <div className="profile-grid">
            <div className="bio-panel">
              <span className="panel-label">PLAYER PROFILE</span>
              <h3>Identity / AI 产品助理</h3>
              <p>求职方向：AI 产品助理。具备需求拆解、AI 工作流设计、MVP 开发与云部署实践，也有 B 端信贷流程、用户访谈与 SQL 分析经验。关注 AI 结果可信度、失败降级和数据安全。</p>
              <div className="contact-grid">
                {contactLinks.map((item) => (
                  <a href={item.href} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </a>
                ))}
              </div>
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
                    <ul className="experience-points">
                      {item.points.map((point) => (
                        <li key={point.label}><b>{point.label}</b>{point.text}</li>
                      ))}
                    </ul>
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
            <p>两个已上线的独立产品，分别探索个人资料检索，以及职业角色提示词的选择与复用。</p>
          </div>

          <div className="mission-board">
            <div className="mission-list">
              {projects.map((project) => (
                <button
                  className={project.id === activeProject.id ? "mission-card active" : "mission-card"}
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  type="button"
                  aria-pressed={project.id === activeProject.id}
                  aria-controls="project-detail"
                >
                  <span>{project.date} · 独立项目</span>
                  <strong>{project.name}</strong>
                  <small>{project.role}</small>
                </button>
              ))}
            </div>

            <article className="mission-detail" id="project-detail" aria-label={activeProject.name}>
              <div className={activeProject.image ? "mission-image product-screenshot" : "mission-image project-cover"}>
                {activeProject.image ? (
                  <img src={activeProject.image} alt={activeProject.imageAlt || "记着公开演示站实际界面：记忆分类、个人资料检索与记忆助手"} loading="lazy" width="1440" height="1000" />
                ) : (
                  <div className="project-cover-copy">
                    <span>Prompt Market</span>
                    <strong>让好用的 Prompt<br />成为可复用的资产。</strong>
                    <p>版本管理、运行测试、语义搜索与成本看板</p>
                  </div>
                )}
              </div>
              <div className="mission-copy">
                <span>{activeProject.role}</span>
                <h3>{activeProject.name}</h3>
                <p>{activeProject.summary}</p>
                <div className="project-access">
                  {activeProject.demo && <a className="primary-link" href={activeProject.demo} target="_blank" rel="noreferrer">体验{activeProject.name}</a>}
                  {activeProject.caseStudy && <a className="secondary-link" href={activeProject.caseStudy}>查看产品案例</a>}
                  <p>{activeProject.demoNote}</p>
                </div>
                <div className="mission-brief">
                  {activeProject.brief.map((item) => (
                    <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>
                  ))}
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
                <div className="card-meta"><span>{item.use}</span></div>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="closing-section" id="contact">
        <div className="ending-panel frame">
          <span>RESULT SCREEN</span>
          <h2>期待一起把想法做成产品。</h2>
          <p>THANKS FOR WATCHING / 李国豪 / AI 产品助理</p>
          <div className="ending-status">
            <span>Next action</span>
            <strong>期待一次面对面的产品讨论</strong>
          </div>
          <div className="closing-actions">
            <a className="primary-link" href="mailto:alicccccc@qq.com">发送邮件</a>
            <a className="secondary-link" href={contactLinks[2].href}>查看 GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;













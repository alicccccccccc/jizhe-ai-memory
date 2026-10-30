import { useState } from 'react';
import './prompt-market-case.css';

const appUrl = 'https://prompt-market-3zx.pages.dev/';
const sourceUrl = 'https://github.com/alicccccccccc/prompt-market';
const scenarios = [
  { role: '产品经理', task: '为自由职业者的记账应用规划首个版本', result: '问题定义、需求优先级、PRD、验收标准', url: 'product-manager' },
  { role: '前端开发者', task: '把产品想法变成可以打开的网页', result: '界面实现、交互状态、响应式布局与验证', url: 'engineering-frontend-developer' },
];

export default function PromptMarketCase() {
  const [scenario, setScenario] = useState(0);
  const selected = scenarios[scenario];
  return <div className="market-case">
    <a className="case-skip" href="#case-main">跳到案例内容</a>
    <nav className="case-nav case-width" aria-label="案例导航">
      <a href="./#projects">← 返回作品集</a>
      <span>李国豪 · 独立产品</span>
      <a href={appUrl} target="_blank" rel="noreferrer">打开产品 ↗</a>
    </nav>
    <main id="case-main">
      <header className="case-intro case-width">
        <p className="case-status">已上线 · 2026.10</p>
        <h1>Prompt 菜市场</h1>
        <p className="case-subtitle">职业 AI 角色与任务工作台</p>
        <p className="case-lead">独立完成产品设计、交互设计、前端开发与上线部署，设计从角色查找、任务填写到提示词与 Codex 技能包导出的完整使用流程。</p>
        <div className="case-actions"><a className="case-primary" href={appUrl} target="_blank" rel="noreferrer">体验 Prompt 菜市场 ↗</a><a href={sourceUrl} target="_blank" rel="noreferrer">查看 GitHub 源码 ↗</a></div>
        <dl className="case-facts"><div><dt>我的职责</dt><dd>独立产品设计 / 交互设计 / 开发部署</dd></div><div><dt>核心功能</dt><dd>角色检索 / 任务工作台 / 技能导出</dd></div><div><dt>实现方式</dt><dd>React / Vite / Cloudflare Pages</dd></div></dl>
      </header>
      <figure className="case-screen case-width"><img src="./prompt-market-demo.jpg" width="1440" height="900" alt="Prompt 菜市场线上首页，展示互动网格、卡通职业角色及分类搜索"/><figcaption>线上产品实拍。卡通角色承载职业身份，任务场景帮助用户判断该选谁。</figcaption></figure>
      <section className="case-section case-width case-argument" aria-labelledby="case-problem"><h2 id="case-problem">要解决的问题</h2><div><p>使用职业角色提示词时，用户需要先判断哪个角色适合当前任务，再补充自己的目标、背景和交付要求。</p><p>我将角色查找、任务填写和导出使用组合成连续流程：通过分类和任务示例辅助选择，在工作台整理任务材料，再把完整内容带到用户自己的 AI 工具中使用。</p></div></section>
      <section className="case-section case-width" aria-labelledby="case-flow"><h2 id="case-flow">我设计的使用流程</h2><ol className="case-flow"><li><b>挑选角色</b><p>通过职业分类、关键词搜索和任务示例查找角色，支持收藏与加入菜篮。</p></li><li><b>写下任务</b><p>在工作台补充目标、材料和输出要求。示例可直接填入，草稿留在当前浏览器。</p></li><li><b>复制或打包</b><p>复制完整提示词，下载 Markdown 任务，或将所选角色打包为 Codex 技能文件。</p></li></ol>
        <div className="case-scenario"><div className="case-scenario-tabs" role="group" aria-label="选择任务示例">{scenarios.map((item,index)=><button type="button" key={item.url} aria-pressed={scenario===index} onClick={()=>setScenario(index)}>{item.role}</button>)}</div><p className="case-task">{selected.task}</p><p className="case-output"><b>期望交付</b>{selected.result}</p><a href={`${appUrl}#role/${selected.url}`} target="_blank" rel="noreferrer">用这位角色试一试 ↗</a></div>
      </section>
      <section className="case-section case-width case-decisions" aria-labelledby="case-decisions"><h2 id="case-decisions">我负责的产品设计</h2><dl><div><dt>信息架构</dt><dd>按职业与工作场景组织角色。卡片先展示适用任务和交付内容，完整提示词放到工作台查看，让浏览与使用各有重点。</dd></div><div><dt>任务输入结构</dt><dd>将输入拆为目标、背景和输出要求，提供示例填充与结果预览，支持复制、Markdown 下载和 Codex 技能包导出。</dd></div><div><dt>视觉与操作</dt><dd>以卡通角色卡呈现职业身份，搭配互动网格背景；通过收藏和菜篮支持角色复用与批量导出，并适配桌面和手机操作。</dd></div></dl></section>
      <section className="case-section case-width case-validation" aria-labelledby="case-validation"><h2 id="case-validation">开发与上线</h2><p>使用 React 与 Vite 完成前端开发，以浏览器本地存储保存草稿、收藏和菜篮，独立部署至 Cloudflare Pages。</p><p>已完成桌面、平板与手机布局检查，并验证角色检索、任务组合与技能包导出流程。</p><div className="case-actions"><a className="case-primary" href={appUrl} target="_blank" rel="noreferrer">打开产品，试一份任务 ↗</a><a href="./#projects">回到全部作品 →</a></div></section>
    </main>
    <footer className="case-footer case-width">李国豪 · AI 产品助理<span>Prompt 菜市场 / 产品案例</span></footer>
  </div>;
}

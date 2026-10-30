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
        <p className="case-subtitle">挑个职业角色，把手头的事做起来。</p>
        <p className="case-lead">面向创作者、产品运营人员与独立开发者，把长篇角色提示词整理成可挑选、可填写任务、可导出使用的职业搭档。</p>
        <div className="case-actions"><a className="case-primary" href={appUrl} target="_blank" rel="noreferrer">体验 Prompt 菜市场 ↗</a><a href={sourceUrl} target="_blank" rel="noreferrer">查看 GitHub 源码 ↗</a></div>
        <dl className="case-facts"><div><dt>我的职责</dt><dd>内容精选 / 产品设计 / 开发部署</dd></div><div><dt>当前范围</dt><dd>108 个角色 · 9 个工作分类</dd></div><div><dt>实现方式</dt><dd>React / Vite / Cloudflare Pages</dd></div></dl>
      </header>
      <figure className="case-screen case-width"><img src="./prompt-market-demo.jpg" width="1440" height="900" alt="Prompt 菜市场线上首页，展示互动网格、卡通职业角色及分类搜索"/><figcaption>线上产品实拍。卡通角色承载职业身份，任务场景帮助用户判断该选谁。</figcaption></figure>
      <section className="case-section case-width case-argument" aria-labelledby="case-problem"><h2 id="case-problem">从一大段提示词，<br/>到一份能开始的任务。</h2><div><p>角色库内容丰富，但用户需要先判断角色是否适合自己，再把通用方法和真实任务接起来。只提供复制按钮，仍会把任务描述的负担留给用户。</p><p>这个版本将选择和使用放在同一条链路：按工作找到角色，查看任务示例，填写目标、背景和交付要求，再把组合好的内容带去自己的 AI 工具。</p></div></section>
      <section className="case-section case-width" aria-labelledby="case-flow"><h2 id="case-flow">让角色带着任务离开市场</h2><ol className="case-flow"><li><b>挑选角色</b><p>九个分类、关键词搜索、收藏和随机逛一家。每个角色都有任务介绍与交付清单。</p></li><li><b>写下任务</b><p>在工作台补充目标、材料和输出要求。示例可直接填入，草稿留在当前浏览器。</p></li><li><b>复制或打包</b><p>带走完整角色与任务，或批量导出 Codex 技能、Markdown 任务文件及来源许可。</p></li></ol>
        <div className="case-scenario"><div className="case-scenario-tabs" role="group" aria-label="选择任务示例">{scenarios.map((item,index)=><button type="button" key={item.url} aria-pressed={scenario===index} onClick={()=>setScenario(index)}>{item.role}</button>)}</div><p className="case-task">{selected.task}</p><p className="case-output"><b>期望交付</b>{selected.result}</p><a href={`${appUrl}#role/${selected.url}`} target="_blank" rel="noreferrer">用这位角色试一试 ↗</a></div>
      </section>
      <section className="case-section case-width case-decisions" aria-labelledby="case-decisions"><h2 id="case-decisions">这个版本的取舍</h2><dl><div><dt>精选与适配</dt><dd>从 276 个公开授权角色中选出 108 个，保留专业方法，补充任务示例、交付清单与工作约定。角色来源和 MIT 许可随导出包保留。</dd></div><div><dt>Codex 通过文件协作</dt><dd>导出标准 SKILL.md 与任务文件，用户在自己的项目中使用。网页不远程控制会话，也不要求填写 API Key。</dd></div><div><dt>先验证使用链路</dt><dd>无需账号，草稿、收藏与菜篮保存在当前浏览器。本版没有云同步、托管模型推理或向量语义搜索。</dd></div></dl></section>
      <section className="case-section case-width case-validation" aria-labelledby="case-validation"><h2 id="case-validation">交付与验证</h2><p>独立 Cloudflare Pages 部署，与作品集、记着演示站分开。已检查桌面、平板与手机布局，并验证 108 份角色文件、分类数量、搜索和技能压缩包结构。</p><p>当前处于首版审查与测试阶段，尚未收集用户留存或任务完成率等数据。</p><div className="case-actions"><a className="case-primary" href={appUrl} target="_blank" rel="noreferrer">打开产品，试一份任务 ↗</a><a href="./#projects">回到全部作品 →</a></div></section>
    </main>
    <footer className="case-footer case-width">李国豪 · AI 产品助理<span>Prompt 菜市场 / 产品案例</span></footer>
  </div>;
}

import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const sections = [
  { n: '01', label: 'ABOUT', path: '/about' }, { n: '02', label: 'EXPERIENCE', path: '/experience' },
  { n: '03', label: 'PROJECTS', path: '/projects' }, { n: '04', label: 'TOOLKIT', path: '/skills' }, { n: '05', label: 'CONNECT', path: '/contact' },
];
const github = 'https://github.com/mehazinfaizal';
const linkedin = 'https://www.linkedin.com/in/mehazin-faizal';
const projects = [
  { id: 'serverless-notes-api', number: '01', title: 'Serverless Notes API', type: 'SERVERLESS API', text: 'A serverless API for creating and managing notes. It uses API Gateway to receive requests, Python code running in AWS Lambda to handle the API logic, and DynamoDB to store notes. I tested the API with Postman.', stack: ['Amazon API Gateway', 'AWS Lambda', 'Amazon DynamoDB', 'Python', 'Postman'], href: `${github}/serverless-notes-api` },
  { id: 'youtube', number: '02', title: 'YouTube Content Strategy Analysis', type: 'PERSONAL PROJECT', text: 'Collected and analysed YouTube content data via APIs, applying NLP to surface patterns and presenting insights in interactive dashboards to support content strategy decisions.', stack: ['APIs', 'Python', 'NLP', 'Power BI', 'Power Query'], href: `${github}/Youtube-Content-Strategy-Dashboard-Report` },
  { id: 'english', number: '03', title: 'AI-Powered English Learning Platform', type: 'COLLEGE PROJECT', text: 'A college project featuring voice interaction for English learning, designed to make practice more conversational and improve user engagement.', stack: ['NLP', 'Dart', 'Python', 'Django', 'Google GenAI', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Flutter'], href: `${github}/AI-POWERED-ENGLISH-LEARNING-PLATFORM-WITH-VOICE-INTERACTION-FOR-ENHANCED-USER-ENGAGEMENT` },
  { id: 'student', number: '04', title: 'Student Performance Analysis', type: 'DATA ANALYSIS', text: 'Analyzed factors linked to student exam results and built a machine-learning model to classify performance as above or below the median.', stack: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter Notebook', 'SVM'], href: `${github}/Student-Performance-Analysis` },
  { id: 'attrition', number: '05', title: 'HR Attrition Risk Analysis', type: 'DATA ANALYSIS', text: 'Created an interactive dashboard to explore employee attrition patterns and examine factors such as department, salary, overtime, promotion delays, and work-life balance.', stack: ['Power BI', 'DAX', 'Data Modeling'], href: `${github}/HR-Attrition-Risk-Analysis` },
  { id: 'perfume', number: '06', title: 'UAE & GCC Perfume Market Research', type: 'MARKET RESEARCH', text: 'Researched fragrance market trends, consumer segments, product categories, competitors, pricing, and business opportunities across the UAE and GCC.', stack: ['Market Research', 'Business Analysis'], href: `${github}/UAE-GCC-Perfume-Market-Research-Business-Opportunities` },
  { id: 'salary-prediction', number: '07', title: 'Salary Prediction with Linear Regression', type: 'MACHINE LEARNING', text: 'Built a PySpark machine-learning pipeline to prepare employee data, engineer features, train a linear regression model, and predict salaries.', stack: ['Python', 'PySpark', 'PySpark ML', 'Linear Regression'], href: `${github}/Salary-prediction-using-Linear-regression` },
  { id: 'aws-ecommerce-pipeline', number: '08', title: 'AWS E-Commerce Analytics Pipeline', type: 'DATA ENGINEERING', text: 'Built a serverless ETL pipeline that cleans and validates retail transaction data, separates rejected records, and prepares curated sales data for analysis.', stack: ['Python', 'AWS S3', 'AWS Lambda', 'Amazon Athena', 'AWS IAM', 'SQL', 'boto3'], href: `${github}/aws-ecommerce-analytics-pipeline` },
  { id: 'smart-food-waste-tracker', number: '09', title: 'Smart Food-Waste Tracker', type: 'DATA ENGINEERING', text: 'Built a daily AWS batch pipeline to help grocery stores identify fresh inventory at risk of expiring unsold. The pipeline cleans sales and expiry-dated inventory data, estimates remaining stock and potential waste cost from recent sales, and sends staff email alerts through SNS when configured risk criteria are met. Athena queries support analysis of the cleaned data.', stack: ['Amazon S3', 'AWS Glue', 'Amazon Athena', 'Amazon SNS', 'Python', 'PySpark', 'SQL'], href: `${github}/Smart-food-waste-tracker` },
  { id: 'php-mysql-crud-docker', number: '10', title: 'PHP-MYSQL-CRUD-App-Using-Docker', type: 'WEB APPLICATION', text: 'A simple CRUD web application built with PHP and MySQL, containerized with Docker. It lets users create, view, update, and delete records through a web interface. Docker containers provide the application and database services, connected through a shared network.', stack: ['Docker', 'MySQL', 'PHP'], href: `${github}/PHP-MYSQL-CRUD-App-Using-Docker` },
];
function go(path: string) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function Link({ to, children, className = '' }: {to:string; children:React.ReactNode; className?:string}) { return <a className={className} href={to} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); go(to); } }}>{children}</a>; }
function LocalClock({ now }: { now: Date }) {
  const [weather, setWeather] = useState<{
    temperature: number;
    code: number;
    isDay: boolean;
  } | null>(null);
  const [weatherMessage, setWeatherMessage] = useState('');

  function loadWeather() {
    if (!navigator.geolocation) {
      setWeatherMessage('LOCATION UNAVAILABLE');
      return;
    }

    setWeatherMessage('LOCATING…');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            latitude: String(coords.latitude),
            longitude: String(coords.longitude),
            current: 'temperature_2m,weather_code,is_day',
            timezone: 'auto',
            temperature_unit: 'celsius',
          });
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          );
          if (!response.ok) throw new Error('Weather request failed');

          const data = await response.json();
          setWeather({
            temperature: data.current.temperature_2m,
            code: data.current.weather_code,
            isDay: Boolean(data.current.is_day),
          });
          setWeatherMessage('');
        } catch {
          setWeatherMessage('WEATHER UNAVAILABLE');
        }
      },
      () => setWeatherMessage('LOCATION NOT SHARED'),
      { timeout: 12000, maximumAge: 300000 },
    );
  }

  const weatherDescription = (code: number) => {
    if (code === 0) return 'CLEAR';
    if (code <= 2) return 'PARTLY CLOUDY';
    if (code === 3) return 'OVERCAST';
    if (code === 45 || code === 48) return 'FOGGY';
    if (code <= 57) return 'DRIZZLE';
    if (code <= 67 || (code >= 80 && code <= 82)) return 'RAIN';
    if (code <= 77 || (code >= 85 && code <= 86)) return 'SNOW';
    if (code >= 95) return 'THUNDERSTORM';
    return 'CLOUDY';
  };

  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(now);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
  const timeZone = new Intl.DateTimeFormat(undefined, {
    timeZoneName: 'short',
  })
    .formatToParts(now)
    .find((part) => part.type === 'timeZoneName')?.value;

  return (
    <div className="clock-widget">
      <div className="chart-wrap clock-wrap" aria-label="Your local date and time">
        <div className="chart-head clock-head">
          <i /> LOCAL TIME <span>↻</span>
        </div>
        <time className="clock-date" dateTime={now.toISOString()}>
          {date}
        </time>
        <time className="clock-time" dateTime={now.toISOString()}>
          {time}
        </time>
        <span className="clock-zone">{timeZone}</span>
        {weather ? (
          <div className="weather-result" aria-live="polite">
            <span className="weather-icon" aria-hidden="true">
              {weather.isDay ? '☼' : '☾'}
            </span>
            <span className="weather-temperature">
              {Math.round(weather.temperature)}°C
            </span>
            <span className="weather-condition">
              {weatherDescription(weather.code)}
            </span>
            <button
              className="weather-refresh"
              type="button"
              onClick={loadWeather}
              aria-label="Refresh local weather"
            >
              ↻
            </button>
          </div>
        ) : (
          <button
            className="weather-trigger"
            type="button"
            onClick={loadWeather}
            disabled={weatherMessage === 'LOCATING…'}
            aria-live="polite"
          >
            {weatherMessage || 'GET LOCAL WEATHER ↗'}
          </button>
        )}
      </div>
    </div>
  );
}
function Sticker({className='', children}:{className?:string;children:React.ReactNode}) { return <div className={`sticker ${className}`}>{children}</div>; }

type TicMark = 'X' | 'O';
type TicCell = TicMark | null;
const ticLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getTicLine(board: TicCell[]) {
  return ticLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function chooseComputerMove(board: TicCell[]) {
  for (const mark of ['O', 'X'] as TicMark[]) {
    for (let index = 0; index < board.length; index++) {
      if (board[index]) continue;
      const candidate = [...board];
      candidate[index] = mark;
      if (getTicLine(candidate)) return index;
    }
  }
  if (!board[4]) return 4;
  return [0, 2, 6, 8, 1, 3, 5, 7].find((index) => !board[index]) ?? 0;
}

function TicTacToe() {
  const [board, setBoard] = useState<TicCell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<TicMark>('X');
  const winningLine = getTicLine(board);
  const isDraw = !winningLine && board.every(Boolean);

  useEffect(() => {
    if (turn !== 'O' || winningLine || isDraw) return;
    const timer = window.setTimeout(() => {
      const next = [...board];
      next[chooseComputerMove(board)] = 'O';
      setBoard(next);
      setTurn('X');
    }, 360);
    return () => window.clearTimeout(timer);
  }, [board, isDraw, turn, winningLine]);

  function play(index: number) {
    if (turn !== 'X' || board[index] || winningLine || isDraw) return;
    const next = [...board];
    next[index] = 'X';
    setBoard(next);
    if (!getTicLine(next) && !next.every(Boolean)) setTurn('O');
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn('X');
  }

  const winner = winningLine ? board[winningLine[0]] : null;
  const status = winner === 'X'
    ? 'YOU WIN / X'
    : winner === 'O'
      ? 'COMPUTER WINS'
      : isDraw
        ? 'DRAW GAME'
        : turn === 'O'
          ? 'COMPUTER THINKING…'
          : 'YOUR MOVE / X';

  return (
    <section className="tic-game" aria-label="Tic Tac Toe against the computer">
      <div className="tic-game-top">
        <span>POCKET GAME / 01</span>
        <span>YOU X · CPU O</span>
      </div>
      <div className="tic-game-title">
        <strong>TIC TAC TOE</strong>
        <button type="button" onClick={reset} aria-label="Reset Tic Tac Toe">↻</button>
      </div>
      <div className="tic-board" role="group" aria-label="Tic Tac Toe board">
        {board.map((mark, index) => (
          <button
            key={index}
            type="button"
            className={`tic-cell ${mark ? `is-${mark.toLowerCase()}` : ''} ${winningLine?.includes(index) ? 'is-winner' : ''}`}
            onClick={() => play(index)}
            disabled={Boolean(mark) || turn !== 'X' || Boolean(winningLine) || isDraw}
            aria-label={`Square ${index + 1}: ${mark || 'empty'}`}
          >
            {mark}
          </button>
        ))}
      </div>
      <div className="tic-game-status" aria-live="polite">
        <span>{status}</span>
        {(winner || isDraw) && <button type="button" onClick={reset}>PLAY AGAIN ↗</button>}
      </div>
    </section>
  );
}

function IDCard() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const [flipped, setFlipped] = useState(false); const [tilt,setTilt] = useState({x:0,y:0}); const card=useRef<HTMLDivElement>(null); const drag=useRef({x:0,y:0,active:false});
  function move(e:React.PointerEvent) { if (e.pointerType !== 'mouse' || !card.current) return; const r=card.current.getBoundingClientRect(); setTilt({x:((e.clientY-r.top)/r.height-.5)*-4,y:((e.clientX-r.left)/r.width-.5)*4}); }
  function down(e:React.PointerEvent) { if((e.pointerType==='mouse' && e.button!==0) || (e.pointerType!=='mouse' && e.pointerType!=='touch')) return; drag.current={x:e.clientX,y:e.clientY,active:true}; }
  function up(e:React.PointerEvent) { if(!drag.current.active)return; const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y; drag.current.active=false; if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.2)setFlipped(dx<0); }
  return <main className="home-shell"><div className="desk-note"><span></span><span></span></div><div className="stage" onPointerMove={move} onPointerLeave={()=>setTilt({x:0,y:0})} onPointerDown={down} onPointerUp={up} onPointerCancel={()=>{drag.current.active=false;setTilt({x:0,y:0})}}>
    <div ref={card} className={`id-card ${flipped?'is-flipped':''}`} style={{'--tilt-x':`${tilt.x}deg`,'--tilt-y':`${tilt.y}deg`} as React.CSSProperties}>
      <article className="card-face card-front" aria-label="Front of portfolio identity card" aria-hidden={flipped} inert={flipped}>
        <div className="card-grain"/><div className="card-top"><span className="micro">MF / 0067-IN</span><span className="status"><i/> PERSONAL PORTFOLIO</span><span className="micro">ISSUED 2026</span></div>
        <div className="card-title"><span className="eyebrow">PERSONAL ARCHIVE</span><h1>PORTFOLIO<br/><em>ID CARD</em></h1><div className="title-stamp"><img src="/stamp_7.png" alt="Kerala postage stamp" /></div></div> 
        
        <div className="identity"><div className="portrait"><img className="portrait-photo" src="/mehazin-photo.jpeg" alt="Mehazin Faizal"/><small>Manali</small><span className="portrait-caption">JAN / 2025</span></div><div className="identity-copy"><span className="micro">CARDHOLDER</span><h2>MEHAZIN<br/>FAIZAL<span>®</span></h2><div className="roleline"><span className="red-dot"/> DATA ALCHEMIST<br/><span className="role-indent">Shutterbug</span></div><LocalClock now={now}/></div></div>
        <div className="card-rule"/><div className="sections-head"><span>SELECT A RECORD</span><span>↘ ROUTE INDEX</span></div><nav className="card-nav" aria-label="Portfolio sections">{sections.map(s=><Link key={s.path} to={s.path}><span>{s.n}</span><b>{s.label}</b><i>↗</i></Link>)}</nav>
        <div className="archive-band">
          <div className="archive-details">
            <strong>SINCE: APRIL / 2003</strong>
          </div>
          <div className="archive-barcode" aria-hidden="true">
            {Array.from({ length: 42 }, (_, index) => (
              <i key={index} className={index % 5 === 0 ? 'wide' : index % 3 === 0 ? 'mid' : ''} />
            ))}
          </div>
        </div>
        <div className="card-bottom"><span>CLICK TO EXPLORE</span><button type="button" className="flip-control" onClick={()=>setFlipped(true)} aria-label="Flip card to reverse side">FLIP CARD <b>↻</b></button><span className="micro">INDIA-UAE</span></div>
      </article>
      <article className="card-face card-back" aria-label="Reverse of portfolio identity card" aria-hidden={!flipped} inert={!flipped}>
        <div className="card-grain"/><div className="back-head"><span className="micro">MF / 0067-IN</span><span>REVERSE / PERSONAL MARKS</span><span className="micro">23—IN</span></div>
        <div className="sticker-field"><TicTacToe/><Sticker className="sticker-sun">STAY<br/>CURIOUS <i>✳</i></Sticker><Sticker className="sticker-data"><b>∿</b><small>BRAIN GO<br/>BRRR</small></Sticker><Sticker className="sticker-build">JUST<br/>BUILD IT <i>↗</i></Sticker><Sticker className="sticker-learn"><b>∞</b><small>ALWAYS IN<br/>BETA</small></Sticker><Sticker className="sticker-idea"><b>⚛</b>IDEAS<br/>IN MOTION</Sticker><Sticker className="sticker-curiosity"><b>⌨</b><small>SHIP IT!</small></Sticker><Sticker className="sticker-datapoint"><b>⋆⋆⋆</b>GOOD IDEAS<br/>NEED DATA</Sticker><span className="scribble">data in, magic out ⍟</span></div>
        <div className="back-lower"><div className="qr-placeholder"><div className="qr-grid">{Array.from({length:49},(_,i)=><i key={i} className={[0,1,2,7,9,14,15,16,4,5,6,11,13,18,19,20,28,29,30,35,37,42,43,44,32,33,34,39,41,46,47,48].includes(i)?'on':''}/>)}</div><span>QR / RESERVED</span></div><div className="social-icons" aria-label="Profile and resume links"><a className="social-icon" href={github} target="_blank" rel="noreferrer" aria-label="Visit GitHub profile" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77a5.07 5.07 0 0 0-.09-3.75S18.73.64 16 3.5a13.38 13.38 0 0 0-7 0C6.27.64 5.09 1.02 5.09 1.02A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.1V22"/></svg></a><a className="social-icon" href={linkedin} target="_blank" rel="noreferrer" aria-label="Visit LinkedIn profile" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.4h3.6V20H5.2zM7 3.5a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM11 8.4h3.5V10c.6-1.1 1.8-1.9 3.5-1.9 3.5 0 4.1 2.3 4.1 5.3V20h-3.7v-5.8c0-1.4-.1-3.2-2-3.2-1.9 0-2.2 1.5-2.2 3.1V20h-3.7V8.4Z"/></svg></a><a className="social-icon" href="/Mehazin_Faizal_Resume_.pdf" download="Mehazin_Faizal_Resume.pdf" aria-label="Download resume PDF" title="Download Resume"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.75h8l4 4V21H6zM14 2.75v4h4M9 12h6m-6 3h6"/></svg></a></div><p className="back-headline">Make the complex<br/>clear enough to move.</p></div>
        <div className="card-bottom back-bottom"><span>ANALYZE / BUILD / DELIVER</span><button type="button" className="flip-control" onClick={()=>setFlipped(false)} aria-label="Flip card back to front">RETURN <b>↻</b></button><span className="micro">END OF RECORD</span></div>
      </article>
    </div></div><div className="home-caption"><span></span><span className="drag-hint">↔ DRAG OR USE FLIP CONTROL</span><span></span></div><div className="mobile-foot">MEHAZIN FAIZAL <span>·</span> DATA / DELIVERY / IDEAS</div></main>;
}

function Shell({children,active}:{children:React.ReactNode;active:string}) { const idx=sections.findIndex(s=>s.path===active); const prev=sections[(idx+sections.length-1)%sections.length],next=sections[(idx+1)%sections.length]; return <main className="page-shell"><header className="page-top"><Link to="/" className="back-link">↖ <span>BACK TO ID CARD</span></Link><span className="micro">MEHAZIN FAIZAL ~ PORTFOLIO</span><a className="top-contact" href="mailto:mehzi2003@gmail.com">SAY HELLO ↗</a></header><section className="page-content">{children}</section><footer className="page-footer"><span>MF / 001—IN</span><div className="prev-next"><Link to={prev.path}>← {prev.label}</Link><i/><Link to={next.path}>{next.label} →</Link></div><span>© 2026</span></footer></main>; }
function PageHeading({number,kicker,title,desc}:{number:string;kicker:string;title:React.ReactNode;desc?:string}) { return <div className="page-heading"><div className="heading-meta"><span>{number} / {kicker}</span><span>PERSONAL ARCHIVE · INDIA</span></div><h1>{title}</h1>{desc&&<p className="page-intro">{desc}</p>}</div>; }
function About() {
  return (
    <Shell active="/about">
      <PageHeading
        number="01"
        kicker="ABOUT"
        title={
          <>
            MAKE DATA
            <br />
            <em>MAKE SENSE.</em>
          </>
        }
        desc="I build data stuff, figure things out, and make messy things make sense."
      />

      <div className="about-grid">
        <div className="about-copy">
          <span className="micro">SO, WHO'S THIS GUY?</span>
          <p className="large-copy">
            Hey, I'm Mehazin. I work with data, build pipelines, and manage
            projects from idea to done.
          </p>
          <p>
            I'm into making data systems work better, automating the boring
            stuff, and turning numbers into something people can actually use.
          </p>
          <p>
            From analytics and ETL pipelines to building websites and managing
            projects, I like figuring out how things fit together and making
            them work.
          </p>
        </div>

        <aside className="about-aside">
          <div className="about-photo-frame">
            <img
              className="about-photo"
              src="/mehazin-about-photo.jpeg"
              alt="Mehazin photographing a landscape"
            />
          </div>
          <dl>
            <div>
              <dt>BASED IN</dt>
              <dd>India / UAE</dd>
            </div>
            <div>
              <dt>WORKING ACROSS</dt>
              <dd>Pipeline · Analytics · Delivery</dd>
            </div>
            <div>
              <dt>EDUCATION</dt>
              <dd>
                B.Tech, Information Technology
                <br />
                APJ Abdul Kalam Technological University
                <br />
                2021-2025
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="resume-cta">
        
        <a
          className="resume-sticker"
          href="/Mehazin_Faizal_Resume_.pdf"
          download="Mehazin-Faizal-Resume.pdf"
        >
          <span>TAKE A LOOK</span>
          <strong>MY RESUME</strong>
          <i>↓ DOWNLOAD</i>
        </a>
      </div>

      <div className="interest-strip">
        <span>AREAS OF INTEREST</span>
        <b>TECH</b>
        <b>FOOTBALL</b>
        <b>PHOTOGRAPHY</b>
        <b>WONDERING &amp; WANDERING</b>
      </div>
    </Shell>
  );
}
function Experience() {
  return (
    <Shell active="/experience">
      <PageHeading
        number="02"
        kicker="EXPERIENCE"
        title={
          <>
            WORK IN
            <br />
            <em>PROGRESS.</em>
          </>
        }
        desc="A few things I've done, learned, and built along the way."
      />

      <div className="timeline">
        <div className="timeline-label">01 / PROJECT MANAGER + DATA CONSULTANT</div>
        <article className="timeline-item">
          <span className="timeline-date">MAY 2026 — OCT 2026</span>
          <div>
            <h2>Project Manager + Data Consultant</h2>
            <p className="org">SOCL · Dubai, UAE</p>

            <h3 className="experience-label">THE CONTEXT</h3>
            <p className="experience-copy">
              After building SOCL&apos;s data ecosystem as a Growth Analyst, I continued
              supporting the business&apos;s data domain while also managing its website
              development project.
            </p>
            <h3 className="experience-label">WHAT I NOTICED</h3>
            <p className="experience-copy">
              The website needed coordination across content, design, and development,
              while the existing data systems needed ongoing maintenance and improvements
              as business requirements changed.
            </p>

            <h3 className="experience-label">WHAT I WORKED ON</h3>
            <p className="experience-subtitle">01 / Website Development</p>
            <ul>
              <li>Managed the website project using an Agile approach, coordinating requirements, content, design, development, and revisions.</li>
              <li>Turned business requirements into clear tasks, tracked deliverables, and kept the project moving.</li>
              <li>Reviewed website updates, coordinated feedback, and worked through issues during development.</li>
            </ul>
            <p className="experience-subtitle">02 / Data &amp; Analytics</p>
            <ul>
              <li>Continued maintaining and extending the data pipelines, dashboards, reporting workflows, and automations built during my Growth Analyst role.</li>
              <li>Improved analytics and reporting workflows as new business requirements came up.</li>
              <li>Kept data solutions reliable and useful for ongoing business and operational decisions.</li>
            </ul>

            <h3 className="experience-label">THE CALL</h3>
            <p className="experience-copy">
              Balanced website delivery with ongoing data support, keeping development
              tasks organized while making sure existing analytics and automation
              solutions continued to meet business needs.
            </p>
            <h3 className="experience-label">THE PAYOFF</h3>
            <ul>
              <li>Coordinated website development from planning through delivery.</li>
              <li>Maintained and extended SOCL&apos;s existing data ecosystem.</li>
              <li>Improved reporting workflows to support changing business needs.</li>
            </ul>
          </div>
        </article>

        <div className="timeline-label">02 / GROWTH ANALYST</div>
        <article className="timeline-item">
          <span className="timeline-date">JAN 2025 — FEB 2026</span>
          <div>
            <h2>Growth Analyst</h2>
            <p className="org">SOCL · Dubai, UAE</p>

            <h3 className="experience-label">THE PROBLEM</h3>
            <p className="experience-copy">
              Business data was scattered across Zoho CRM, Zoho Books, Meta Ads, and
              Monday.com. Getting a clear picture of business performance meant spending
              too much time combining data, fixing inconsistencies, and preparing reports
              manually.
            </p>
            <h3 className="experience-label">WHAT I NOTICED</h3>
            <p className="experience-copy">
              The same business information lived across different platforms, making it
              difficult to get one reliable view of sales, marketing, and overall growth.
              Before making better decisions, the team needed data it could actually
              trust.
            </p>
            <h3 className="experience-label">WHAT I BUILT</h3>
            <p className="experience-copy">
              Designed an end-to-end data ecosystem connecting all four platforms through
              automated SQL-based ETL pipelines. Built data validation and reconciliation
              workflows, centralized analytics datasets, and Power BI dashboards to bring
              everything together.
            </p>

            <h3 className="experience-label">THE CALL</h3>
            <ul>
              <li>Connected separate data sources into one reporting workflow instead of handling them individually.</li>
              <li>Added automated checks to catch inconsistencies, trace issues, and improve data reliability.</li>
              <li>Built dashboards around 20+ business KPIs, including CAC, LTV, ARPU, retention, win rate, and pipeline coverage.</li>
              <li>Automated data cleaning, transformation, and reporting using SQL, Python, Power Query, and Power BI.</li>
            </ul>
            <h3 className="experience-label">THE PAYOFF</h3>
            <ul>
              <li><strong>60%</strong> improvement in reporting efficiency.</li>
              <li><strong>60%</strong> improvement in data accuracy.</li>
              <li><strong>15 hours per week</strong> saved through automated reporting and reconciliation.</li>
              <li><strong>100%</strong> of identified discrepancies resolved within 24 hours.</li>
            </ul>
          </div>
        </article>

        <div className="timeline-label education-label">THE LEARNING CURVE</div>
        <article className="timeline-item compact">
          <span className="timeline-date">2021 — 2025</span>
          <div>
            <h2>B.Tech, Information Technology</h2>
            <p className="org">APJ Abdul Kalam Technological University · Kerala, India</p>
          </div>
        </article>
        <article className="timeline-item compact">
          <span className="timeline-date">	THE SKILL-UP ERA </span>
          <div>
            <h2>Badges Unlocked</h2>
            <p className="org">
              Udemy/AWS: AWS Certified Data Engineer Associate · Oct 2026<br />
              Databricks: Databricks Fundamentals · Aug 2026<br />
              Linkedin: Agile Foundation · May 2026<br />
              Oracle: Oracle Data Platform 2025 Certified Foundations Associate · Feb 2026<br />
              Udemy: Complete Data Analyst Bootcamp (Basics to Advanced) · Aug 2025
            </p>
          </div>
        </article>
      </div>
    </Shell>
  );
}
function Projects() { const [open,setOpen]=useState<string|null>(null); return <Shell active="/projects"><PageHeading number="03" kicker="PROJECTS" title={<>BUILT FROM<br/><em>QUESTIONS.</em></>} desc="Random questions, messy data, and ideas I had to try out."/><div className="project-list">{projects.map(p=><article className={`project-card ${open===p.id?'expanded':''}`} key={p.id}><button className="project-main" onClick={()=>setOpen(open===p.id?null:p.id)} aria-expanded={open===p.id}><span className="project-number">{p.number} / {p.type}</span><span className="project-title">{p.title}</span><span className="project-arrow">{open===p.id?'−':'+'}</span></button>{open===p.id&&<div className="project-detail"><p>{p.text}</p><div className="tags">{p.stack.map(t=><span key={t}>{t}</span>)}</div>{p.href?<a className="text-link" href={p.href} target="_blank" rel="noreferrer">OPEN REPOSITORY ↗</a>:<span className="micro">REPOSITORY LINK NOT PROVIDED</span>}</div>}</article>)}</div><p className="source-note"></p></Shell>; }
const skillGroups: [string, string[]][] = 

[['LANGUAGES & TOOLS',['Python','SQL','PySpark','AWS(S3,Athena,Glue,Kinesis,Quicksight,SNS,IAM,EKS,Redshift)','Databricks','Git','Excel','Docker','PowerBI','Zoho Analytics']],

['DATA ENGINEERING',['ETL Development','Data Integration','Data Modelling','Data Quality Management','Data Pipelines','Query Optimization']],

['AI & TEXT ANALYSIS',['TensorFlow','Tokenization','LLM','Text Analytics','NLP']],

['PROJECT DELIVERY',['Project Management','Agile Methodology','Stakeholder Coordination','Requirements Translation']]];
function Skills() { return <Shell active="/skills"><PageHeading number="04" kicker="TOOLKIT" title={<>TOOLS FOR<br/><em>THE WORK.</em></>} desc="The stuff I use to turn ideas into working things."/><div className="skill-grid">{skillGroups.map(([name,items],i)=><section className="skill-group" key={name}><div className="skill-group-head"><span>{String(i+1).padStart(2,'0')}</span><h2>{name}</h2><span>+</span></div><div className="skill-tags">{(items as string[]).map(item=><span key={item}>{item}</span>)}</div></section>)}</div><p className="source-note"></p></Shell>; }
function Contact() { const [status,setStatus]=useState(''); const [started]=useState(Date.now()); function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault(); const f=e.currentTarget; const data=new FormData(f); if(data.get('website')||Date.now()-started<1800){setStatus('Unable to process this message. Please email directly.');return;} const name=String(data.get('name')||'').trim(),email=String(data.get('email')||'').trim(),message=String(data.get('message')||'').trim(); if(!name||!/^\S+@\S+\.\S+$/.test(email)||message.length<10){setStatus('Please check your name, email, and message (at least 10 characters).');return;} window.location.href=`mailto:mehzi2003@gmail.com?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`; setStatus('Your email app should open with a draft. The message has not been sent yet.'); }
  return <Shell active="/contact"><PageHeading number="05" kicker="CONNECT" title={<>LET’S TALK<br/><em>DETAILS.</em></>} desc="For data, analytics, automation, or project delivery conversations."/><div className="contact-grid"><div className="contact-direct"><span className="micro">DIRECT CHANNELS</span><a className="email-link" href="mailto:mehzi2003@gmail.com">mehzi2003<br/>@gmail.com ↗</a><div className="contact-links"><a href={github} target="_blank" rel="noreferrer">GITHUB <span>↗</span></a><a href={linkedin} target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a></div><p className="phone">+91 70120 22039 / +971 506951131<br/><span>INDIA / UAE</span></p></div><form className="contact-form" onSubmit={submit} noValidate><span className="micro">LEAVE A NOTE</span><label>Your name<input name="name" required autoComplete="name" placeholder="Name"/></label><label>Email address<input name="email" type="email" required autoComplete="email" placeholder="you@example.com"/></label><label>Message<textarea name="message" required minLength={10} rows={4} placeholder="What would you like to talk about?"/></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><button className="submit-btn" type="submit">PREPARE EMAIL <span>↗</span></button>{status && <p className="form-note" aria-live="polite">{status}</p>}</form></div></Shell>; }
function ProjectDetail({id}:{id:string}) { const p=projects.find(x=>x.id===id); if(!p)return <NotFound/>; return <Shell active="/projects"><Link to="/projects" className="back-link detail-back">← ALL PROJECTS</Link><PageHeading number={p.number} kicker={p.type} title={<>{p.title.split(' ').slice(0,2).join(' ')}<br/><em>{p.title.split(' ').slice(2).join(' ')}</em></>} desc={p.text}/><div className="detail-panel"><span className="micro">TOOLS / METHODS</span><div className="tags">{p.stack.map(x=><span key={x}>{x}</span>)}</div>{p.href&&<a className="text-link" href={p.href} target="_blank" rel="noreferrer">VIEW SOURCE REPOSITORY ↗</a>}</div></Shell>; }
function NotFound(){return <main className="not-found"><span className="micro">404 / RECORD NOT FOUND</span><h1>THIS PAGE<br/><em>ISN’T FILED.</em></h1><Link to="/">↖ BACK TO ID CARD</Link></main>}
function App(){const [path,setPath]=useState(window.location.pathname); useEffect(()=>{const pop=()=>setPath(window.location.pathname);window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]); useEffect(()=>{document.title=path==='/'?'Mehazin Faizal — Portfolio ID Card':`Mehazin Faizal — ${path.replace('/','').replace(/-/g,' ')}`},[path]); if(path==='/')return <IDCard/>; const detail=path.match(/^\/projects\/([^/]+)$/);if(detail)return <ProjectDetail id={detail[1]}/>; switch(path){case '/about':return <About/>;case '/experience':return <Experience/>;case '/projects':return <Projects/>;case '/skills':return <Skills/>;case '/contact':return <Contact/>;default:return <NotFound/>}}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);







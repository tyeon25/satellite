/* ==========================================================================
   위성전파감시센터 (SRMC) 클라이언트 스크립트
   브라우저에서 더블클릭(file://)으로 서버 없이 즉시 동작
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSpaceCanvas();
  initDutiesTabs();
  initSimulator();
  initCitizenFinder();
  initFAQ();
});

/* 1. 네비게이션 스크롤 감지 및 모바일 메뉴 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* 2. 히어로 섹션 별빛 및 우주 전파 파동 캔버스 애니메이션 */
function initSpaceCanvas() {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 별 생성
  const starsCount = 120;
  const stars = [];
  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  // 감시소 전파 펄스 파동
  const waves = [];
  function addWave() {
    waves.push({
      x: width * 0.5,
      y: height * 0.45,
      radius: 10,
      maxRadius: Math.max(width, height) * 0.6,
      opacity: 0.6
    });
  }
  setInterval(addWave, 2600);

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 별 렌더링
    for (let s of stars) {
      s.alpha += s.speed * s.direction;
      if (s.alpha >= 1) {
        s.alpha = 1;
        s.direction = -1;
      } else if (s.alpha <= 0.2) {
        s.alpha = 0.2;
        s.direction = 1;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184, 134, 77, ${s.alpha * 0.4})`;
      ctx.fill();
    }

    // 전파 파동 렌더링
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.radius += 1.2;
      w.opacity = Math.max(0, 0.45 * (1 - w.radius / w.maxRadius));

      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(184, 134, 77, ${w.opacity * 0.7})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (w.radius >= w.maxRadius || w.opacity <= 0) {
        waves.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* 3. 4대 핵심 업무 탭 전환 */
function initDutiesTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* 4. 가상 위성전파 감시 콘솔 시뮬레이터 */
function initSimulator() {
  const clockEl = document.getElementById('simClock');
  const azEl = document.getElementById('valAz');
  const elEl = document.getElementById('valEl');
  const gaugeEl = document.getElementById('valGauge');
  const dbmEl = document.getElementById('valDbm');
  const nameEl = document.getElementById('infoName');
  const orbitEl = document.getElementById('infoOrbit');
  const freqEl = document.getElementById('infoFreq');
  const bandEl = document.getElementById('infoBand');
  const statusEl = document.getElementById('infoStatus');
  const runTestBtn = document.getElementById('btnRunTest');

  // 실시간 시계 업데이트
  function updateTime() {
    if (!clockEl) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} KST`;
    clockEl.textContent = timeStr;
  }
  setInterval(updateTime, 1000);
  updateTime();

  // 위성 데이터 프리셋
  const satellitesData = {
    sat1: {
      name: '무궁화 6A호 (Koreasat-6A)',
      orbit: '정지궤도 (GEO, 동경 116.0°)',
      freq: '12.540 GHz (Ku-Band)',
      band: '36 MHz / 수평편파 (Horizontal)',
      az: '116.4°',
      el: '48.2°',
      gauge: '88%',
      dbm: '-68.4 dBm (우수)',
      statusHtml: '<span class="badge-status badge-ok">✅ 정상 송출 (ITU 적합)</span>'
    },
    sat2: {
      name: '천리안 2B호 (GK-2B 해양·환경)',
      orbit: '정지궤도 (GEO, 동경 128.2°)',
      freq: '8.125 GHz (X-Band)',
      band: '50 MHz / 원편파 (RHCP)',
      az: '135.8°',
      el: '52.1°',
      gauge: '94%',
      dbm: '-64.1 dBm (매우 우수)',
      statusHtml: '<span class="badge-status badge-ok">✅ 관측 데이터 정상 전송</span>'
    },
    sat3: {
      name: 'Starlink 저궤도 군집위성 #2819',
      orbit: '저궤도 (LEO, 고도 550km 고속공전)',
      freq: '10.950 GHz (Ku-Band)',
      band: '250 MHz / 빔포밍 다중채널',
      az: '215.3°',
      el: '34.7°',
      gauge: '76%',
      dbm: '-73.5 dBm (양호)',
      statusHtml: '<span class="badge-status badge-ok">✅ 저궤도 이동감시 추적 중</span>'
    },
    sat4: {
      name: '미식별 전파원 (간섭 징후 포착)',
      orbit: '저궤도 대역 이상 방사 신호',
      freq: '14.250 GHz (상향 링크 인접)',
      band: '대역폭 초과 및 비인가 주파수 점유',
      az: '172.0°',
      el: '22.4°',
      gauge: '42%',
      dbm: '-89.2 dBm (신호 불안정)',
      statusHtml: '<span class="badge-status badge-warn">⚠️ 주의: 유해 혼신 의심 발신원 추적 중</span>'
    }
  };

  const satNodes = document.querySelectorAll('.sim-sat');
  satNodes.forEach(sat => {
    sat.addEventListener('click', () => {
      satNodes.forEach(s => s.classList.remove('active'));
      sat.classList.add('active');

      const id = sat.dataset.id;
      const data = satellitesData[id];
      if (!data) return;

      // 안테나 지향 애니메이션 시각효과
      nameEl.textContent = data.name;
      orbitEl.textContent = data.orbit;
      freqEl.textContent = data.freq;
      bandEl.textContent = data.band;
      azEl.textContent = data.az;
      elEl.textContent = data.el;
      gaugeEl.style.width = data.gauge;
      dbmEl.textContent = data.dbm;
      statusEl.innerHTML = data.statusHtml;
    });
  });

  // 혼신 탐색 & 스캔 시뮬레이션 버튼
  if (runTestBtn) {
    runTestBtn.addEventListener('click', () => {
      runTestBtn.disabled = true;
      runTestBtn.textContent = '🔄 전파 스펙트럼 전역 정밀 스캐닝 중...';

      gaugeEl.style.width = '10%';
      dbmEl.textContent = '주파수 스위핑 중...';

      setTimeout(() => {
        gaugeEl.style.width = '95%';
        dbmEl.textContent = '스캔 완료: 유해 전파원 TDOA 분석 좌표 확보';
        runTestBtn.textContent = '혼신 탐색 & 스캔 재실행';
        runTestBtn.disabled = false;
        alert('🛰️ [SRMC 관제 알림]\n전파 감시 스캔 완료!\n한반도 상공 통과 위성 제원 100% 정상 수신 상태가 확인되었습니다.');
      }, 1200);
    });
  }
}

/* 5. 국민 맞춤 혜택 & 체크리스트 진단 설문 (Citizen Service Finder) */
function initCitizenFinder() {
  const personaCards = document.querySelectorAll('.persona-card');
  const checklistContainer = document.getElementById('checklistContainer');
  const btnDiagnose = document.getElementById('btnDiagnose');
  const btnResetSurvey = document.getElementById('btnResetSurvey');
  const surveyResultBox = document.getElementById('surveyResultBox');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultCardsContainer = document.getElementById('resultCardsContainer');

  if (!checklistContainer || !btnDiagnose) return;

  // 페르소나별 체크리스트 문항 DB
  const surveyData = {
    citizen: {
      title: '일반 국민을 위한 일상 전파 보호 & 안심 혜택',
      desc: '위성전파감시센터는 보이지 않는 곳에서 국민여러분의 디지털 일상과 안전을 24시간 든든하게 지켜드립니다.',
      questions: [
        {
          id: 'c1',
          title: '스마트폰 GPS 내비게이션, 위치 기반 앱을 자주 사용한다',
          sub: '도심이나 이동 중 GPS 오류나 먹통 현상이 전파 간섭 때문인지 걱정된 적이 있다.',
          weight: 'gps'
        },
        {
          id: 'c2',
          title: '도서·산간 지역에 거주하거나 위성 방송(KT스카이라이프 등)을 시청한다',
          sub: '비가 오지 않는데도 위성 TV 화면이 깨지거나 소리가 끊기는 현상을 겪은 적이 있다.',
          weight: 'broadcast'
        },
        {
          id: 'c3',
          title: '해상 낚시, 요트, 항공기 이용 등 위성 통신 안전에 관심이 있다',
          sub: '바다 한가운데나 상공에서 비상 구조 통신망이 전파 혼신 없이 작동하는지 궁금하다.',
          weight: 'safety'
        },
        {
          id: 'c4',
          title: '국가 전파 주권과 우주 안보(북한 GPS 교란 등)에 관심이 있다',
          sub: '외부 세력의 고의적 전파 방해로부터 우리나라 위성이 어떻게 보호받는지 알고 싶다.',
          weight: 'defense'
        }
      ],
      solutions: [
        {
          category: '생활 전파 보호 서비스',
          title: '실시간 GPS·위성방송 혼신 민원 해결',
          body: '위성 방송 송출 장애나 원인 불명의 GPS 수신 불량이 접수되면 센터의 이동전파감시반이 즉각 출동하여 불법 전파원을 탐색·제거합니다.',
          benefits: ['무료 현장 전파 환경 측정 지원', '유해 혼신원 24시간 삼각측량 추적', '위성방송 품질 모니터링'],
          actionText: '혼신 신고 절차 보기',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '재난·안전 보호망',
          title: '국가 위성 재난안전 통신망 청정구역 유지',
          body: '태풍·홍수 등 지상 통신망이 두절되는 국가 재난 상황에서도 위성 통신과 긴급 구조 전파가 방해받지 않도록 비상 주파수를 최우선 보호합니다.',
          benefits: ['해상/항공 비상 조난 주파수 전용 감시', '소방·해경 위성 통신 무결성 유지', 'KPS 한국형 GPS 인프라 보호'],
          actionText: '국가 안전 전파망 보기',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '대국민 정보 개방',
          title: '위성전파 우주기상 및 감시동향 공개',
          body: '태양 흑점 폭발이나 우주 전파 교란 등 일상 통신에 영향을 줄 수 있는 주요 정보를 분기별 리포트와 알림을 통해 투명하게 공개합니다.',
          benefits: ['분기별 감시동향 리포트 무상 열람', '한반도 상공 위성 통과 현황 정보 제공', '전파 교란 주의보 실시간 공지'],
          actionText: '감시동향 리포트 열람',
          actionUrl: 'https://www.srmc.go.kr'
        }
      ]
    },
    student: {
      title: '미래 과학 인재와 청소년을 위한 우주 교육 프로그램',
      desc: '위성전파감시센터는 청소년들에게 생생한 우주 전파 체험과 이공계 진로 탐색 기회를 제공합니다.',
      questions: [
        {
          id: 's1',
          title: '거대한 우주 기지국 안테나와 관제 센터를 직접 견학해 보고 싶다',
          sub: '영화에서만 보던 직경 13m급 초대형 파라볼라 안테나를 눈앞에서 보고 싶다.',
          weight: 'tour'
        },
        {
          id: 's2',
          title: '항공우주, 전자공학, 인공위성, 통신 분야로 진로를 희망한다',
          sub: '국가 공공기관 연구원들이 실제로 어떤 기술을 다루고 일하는지 멘토링을 받고 싶다.',
          weight: 'career'
        },
        {
          id: 's3',
          title: '방학 중 청소년 우주전파 체험 캠프나 과학 교실에 참여하고 싶다',
          sub: '간이 전파 수신기 만들기, 전파 스펙트럼 측정 등 손으로 만지는 과학 실습을 원한다.',
          weight: 'camp'
        },
        {
          id: 's4',
          title: '학교 과제 및 동아리 활동을 위해 위성 궤도 데이터를 얻고 싶다',
          sub: '정지궤도와 저궤도 위성의 실제 전파 제원 및 궤도 측정 데이터가 필요하다.',
          weight: 'data'
        }
      ],
      solutions: [
        {
          category: '현장 체험 프로그램',
          title: '이천 위성전파감시센터 청소년 현장 견학',
          body: '경기도 이천 센터에 직접 방문하여 초대형 안테나 시설 투어, 24시간 실시간 위성 관제실 견학 및 우주 전파 원리 특강을 들을 수 있습니다.',
          benefits: ['초·중·고 단체 및 개인 견학 무료 지원', '전문 연구원의 맞춤형 시설 해설', '위성 안테나 구동 시연 관람'],
          actionText: '견학 신청 안내 바로가기',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '진로·과학 캠프',
          title: '방학 전파교실 & 이공계 멘토링 프로그램',
          body: '과학기술정보통신부와 함께 주최하는 우주전파 캠프를 통해 안테나 제작 실습, 전파 신호 찾기 보물찾기 등 흥미진진한 체험을 제공합니다.',
          benefits: ['수료증 발급 및 실험 키트 무료 제공', '우주통신 전문가와의 1:1 진로 질의응답', '미래 6G/위성 산업 비전 소개'],
          actionText: '전파 캠프 일정 확인',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '교육용 학습 자료',
          title: '초·중·고 전파 과학 디지털 교재 & 오픈데이터',
          body: '교사와 학생들이 동아리 활동 및 탐구 보고서에 활용할 수 있도록 위성 궤도 계산 원리와 전파 스펙트럼 기초 교육 콘텐츠를 무상 제공합니다.',
          benefits: ['인공위성 통신 기초 e-book 무료 다운로드', '위성 궤도 시각화 교육 자료 열람', '학교 축제/과학의 날 전시 협력 지원'],
          actionText: '학습 자료실 바로가기',
          actionUrl: 'https://www.srmc.go.kr'
        }
      ]
    },
    business: {
      title: '위성·통신·드론·모빌리티 산업계를 위한 원스톱 기술 행정 지원',
      desc: '민간 기업의 우주 서비스가 규제와 혼신 간섭 없이 안정적으로 안착하도록 법률·기술적으로 뒷받침합니다.',
      questions: [
        {
          id: 'b1',
          title: '위성 기지국(지상국) 또는 통신 서비스를 신규 운영·신청 중이다',
          sub: '국제전기통신연합(ITU) 등록 제원과 국내 기술기준 충족 여부를 확인해야 한다.',
          weight: 'itu'
        },
        {
          id: 'b2',
          title: '상용 서비스 중 특정 주파수 대역에서 원인 불명의 혼신 간섭이 발생했다',
          sub: '해외 위성이나 인근 송출소로 인해 서비스 품질이 저하되어 긴급 원인 규명이 필요하다.',
          weight: 'jamming'
        },
        {
          id: 'b3',
          title: '스타링크, 원웹 등 글로벌 저궤도(LEO) 위성망과의 주파수 공유가 필요하다',
          sub: '동일 주파수(Ku/Ka 등) 대역 내 전파 충돌 방지 및 기술 간섭 분석 지원이 절실하다.',
          weight: 'leo'
        },
        {
          id: 'b4',
          title: '드론, 도심항공교통(UAM), 자율주행 위성 항법 연동을 개발 중이다',
          sub: '전파 음영 지역 및 정밀 위성 신호 신뢰성 평가 데이터가 필요하다.',
          weight: 'uam'
        }
      ],
      solutions: [
        {
          category: '긴급 혼신 제거 지원',
          title: '24시간 위성망 유해 혼신 긴급 기술 조사',
          body: '기업 위성망에 불법 간섭이 감지되면 센터의 첨단 신호분석기 및 TDOA/FDOA 삼각측량 기술을 가동하여 전파 간섭 발신지를 역추적해 드립니다.',
          benefits: ['실시간 유해 신호 감지 및 기술 진단 리포트', '국제 신호 규정 위반 시 ITU 공식 중재 의뢰', '현장 이동전파 감시차량 신속 투입'],
          actionText: '혼신 조사 의뢰 절차',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '기술 제원 검증',
          title: '위성 발사 및 지상국 기술 기준 정밀 측정',
          body: '자체 시험 시설이 부족한 중소·스타트업 위성 기업을 위해 중심 주파수, 대역폭, PFD(전력속밀도)를 세계적 수준의 시설로 공인 측정합니다.',
          benefits: ['공인 전파 기술 제원 측정 증명', '국내외 전파 규격 적합성 컨설팅', '안테나 성능 및 스펙트럼 분석 장비 지원'],
          actionText: '기술 측정 서비스 안내',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '민관 기술 교류',
          title: '위성전파 기술 컨퍼런스 & 비즈니스 네트워킹',
          body: '매년 정부 및 산학연 전문가 300여 명이 참가하는 기술 콘퍼런스에서 최신 규제 개정 방향, 주파수 분배 정책, 해외 시장 진출 전략을 공유합니다.',
          benefits: ['위성전파 기술 컨퍼런스 무료 초청', '과기정통부 우주통신 정책 간담회 참여', '신기술 실증(Sandbox) 전파 규제 애로 상담'],
          actionText: '컨퍼런스 일정 안내',
          actionUrl: 'https://www.srmc.go.kr'
        }
      ]
    },
    researcher: {
      title: '산·학·연 연구자와 우주 과학자를 위한 오픈 데이터 & 연구 파트너십',
      desc: '6G NTN, 군집위성 신호처리, 위성 보안 등 미래 우주 통신 핵심 원천기술 연구를 센터가 적극 지원합니다.',
      questions: [
        {
          id: 'r1',
          title: '한반도 상공 통과 위성의 장기 전파 스펙트럼 통계 데이터가 필요하다',
          sub: '국내외 800여기 위성의 연간 감시 실적 및 궤도 변화 빅데이터 분석 연구를 진행 중이다.',
          weight: 'stats'
        },
        {
          id: 'r2',
          title: '6G 비지상 네트워크(NTN) 및 밀리미터파 빔포밍 기술을 연구하고 있다',
          sub: '지상 기지국과 우주 위성 간 전파 간섭 채널 모델링을 실제 필드 데이터로 검증하고 싶다.',
          weight: '6g'
        },
        {
          id: 'r3',
          title: '초소형 큐브위성 군집 운용 및 전파 감시 알고리즘을 개발 중이다',
          sub: '다중 도플러 주파수 천이 및 고속 궤도 추적을 위한 AI 신호처리 알고리즘 테스트가 필요하다.',
          weight: 'algo'
        },
        {
          id: 'r4',
          title: '우주 전파 정책 및 국제전기통신연합(ITU) 전파 규칙(RR) 개정에 참여하고 있다',
          sub: 'WRC(세계전파통신회의) 국가 기고서 작성 및 글로벌 주파수 분배 의제 분석 지원을 원한다.',
          weight: 'policy'
        }
      ],
      solutions: [
        {
          category: '연구용 데이터 개방',
          title: '위성전파 감시 빅데이터 및 측정 원천자료 공유',
          body: '지난 20여 년간 축적된 동경 55도~서경 160도 상공 위성의 전파 측정 원천 데이터 및 스펙트럼 분석 자료를 학술 연구용으로 개방합니다.',
          benefits: ['학술 연구 목적 비공개 측정 자료 협약 제공', '분기별 위성 감시동향 상세 분석 리포트', '주파수 대역별 점유율 통계 데이터 지원'],
          actionText: '학술 데이터 요청 안내',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '공동 R&D 및 테스트베드',
          title: '실제 위성 지상국 인프라 연계 R&D 테스트베드 지원',
          body: '센터가 보유한 초대형 파라볼라 안테나 시스템과 신호분석 장비를 활용하여 개발 중인 신호처리 알고리즘과 수신기의 현장 검증을 돕습니다.',
          benefits: ['지상국 연동 실제 위성 신호 수신 시험 환경 제공', '산학연 공동 국가 R&D 과제 파트너십 구축', '도플러 천이/위상 간섭 시뮬레이션 지원'],
          actionText: '공동 연구 협력 문의',
          actionUrl: 'https://www.srmc.go.kr'
        },
        {
          category: '국제 표준화 협력',
          title: 'ITU-R 표준화 활동 및 WRC 연구반 공동 참여',
          body: '비지상망(NTN), 저궤도 위성 감시 기술 기준 등 ITU-R Study Group 및 국제 표준화 회의에 센터 전문위원과 함께 국가 대표단으로 협력합니다.',
          benefits: ['ITU-R 국제 표준 기고서 공동 채택 추진', '우주 전파 주파수 분배 정책 자문', '선진 해외 전파감시 기관과의 교류 기회'],
          actionText: '국제 표준화 동향 확인',
          actionUrl: 'https://www.srmc.go.kr'
        }
      ]
    }
  };

  let currentPersona = 'citizen';

  // 체크리스트 렌더링 함수
  function renderChecklist(personaKey) {
    currentPersona = personaKey;
    const data = surveyData[personaKey];
    if (!data) return;

    checklistContainer.innerHTML = '';
    data.questions.forEach((q, idx) => {
      const label = document.createElement('label');
      label.className = 'check-item-label';
      label.innerHTML = `
        <input type="checkbox" name="chkItem" value="${q.id}" ${idx === 0 ? 'checked' : ''}>
        <div class="check-text">
          <strong>${q.title}</strong>
          <span>${q.sub}</span>
        </div>
      `;

      const input = label.querySelector('input');
      if (input.checked) label.classList.add('checked');

      input.addEventListener('change', () => {
        if (input.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });

      checklistContainer.appendChild(label);
    });

    // 기존 결과창 숨기기
    surveyResultBox.style.display = 'none';
  }

  // 페르소나 라디오 변경 이벤트
  personaCards.forEach(card => {
    card.addEventListener('click', () => {
      personaCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const personaKey = card.dataset.persona;
      renderChecklist(personaKey);
    });
  });

  // 초기 렌더링
  renderChecklist('citizen');

  // 진단 및 확인 버튼 클릭 시 솔루션 제시
  btnDiagnose.addEventListener('click', () => {
    const checkedBoxes = checklistContainer.querySelectorAll('input[type="checkbox"]:checked');
    const data = surveyData[currentPersona];
    if (!data) return;

    resultTitle.textContent = `${data.title}`;
    resultDesc.textContent = `총 ${checkedBoxes.length}개의 관심 상황을 분석했습니다. 위성전파감시센터가 제공하는 3가지 핵심 지원 서비스를 확인하세요.`;

    resultCardsContainer.innerHTML = '';
    data.solutions.forEach(sol => {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      let benefitsHtml = '';
      sol.benefits.forEach(b => {
        benefitsHtml += `<li>${b}</li>`;
      });

      card.innerHTML = `
        <div class="r-category">${sol.category}</div>
        <h4 class="r-title">${sol.title}</h4>
        <p class="r-body">${sol.body}</p>
        <div class="r-benefit-list">
          <ul>${benefitsHtml}</ul>
        </div>
        <a href="${sol.actionUrl}" target="_blank" rel="noopener noreferrer" class="r-action-btn">
          ${sol.actionText} <span>↗</span>
        </a>
      `;
      resultCardsContainer.appendChild(card);
    });

    surveyResultBox.style.display = 'block';
    surveyResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // 초기화 버튼
  btnResetSurvey.addEventListener('click', () => {
    renderChecklist(currentPersona);
    surveyResultBox.style.display = 'none';
  });
}

/* 6. 국민 FAQ 아코디언 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // 다른 아코디언 닫기
      faqItems.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

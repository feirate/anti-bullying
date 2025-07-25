// 卡片轮播控制器
class CardCarousel {
  constructor(scenarios, skipInitialSort = false) {
    this.scenarios = scenarios || this.getDefaultScenarios();
    this.currentIndex = 0;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isDragging = false;
    
    // 根据参数决定是否执行初始排序
    if (!skipInitialSort) {
      this.performInitialSort();
    } else {
      // 如果跳过排序，仍需要更新完成状态
      this.updateScenariosWithUserData();
    }
    
    this.init();
  }

  // 一次性初始排序（只在轮播创建时执行）
  performInitialSort() {
    if (window.userSystem && window.userSystem.user) {
      const completedScenarios = window.userSystem.user.completed_scenarios || [];
      
      // 更新完成状态
      this.scenarios.forEach(scenario => {
        scenario.completed = completedScenarios.includes(scenario.id);
      });
      
      // 分离未完成和已完成的场景
      const incompleteScenarios = this.scenarios.filter(scenario => !scenario.completed);
      const completedScenariosFiltered = this.scenarios.filter(scenario => scenario.completed);
      
      // 对未完成场景进行混合随机排序
      const sortedIncomplete = this.mixedRandomSort(incompleteScenarios);
      
      // 已完成场景：按难度排序
      const difficultyOrder = { '简单': 1, '中等': 2, '困难': 3 };
      completedScenariosFiltered.sort((a, b) => {
        return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
      });
      
      // 合并：未完成在前，已完成在后
      this.scenarios = [...sortedIncomplete, ...completedScenariosFiltered];
      
      // 重置当前索引到第一个未完成的场景
      this.resetToFirstIncomplete();
    }
  }

  // 更新场景完成状态（不重新排序，保持现有顺序）
  updateScenariosWithUserData() {
    if (window.userSystem && window.userSystem.user) {
      const completedScenarios = window.userSystem.user.completed_scenarios || [];
      
      // 只更新完成状态，不改变场景顺序
      this.scenarios.forEach(scenario => {
        scenario.completed = completedScenarios.includes(scenario.id);
      });
    }
  }

  getDefaultScenarios() {
    return [
      {
        id: 'lunch_exclusion',
        title: '午餐时间',
        category: '社交排斥',
        difficulty: '简单',
        description: '你在食堂里看到小明独自坐在一张桌子旁。附近的一群学生正在笑着指着小明，大声评论他的衣服和午餐。',
        completed: false
      },
      {
        id: 'game_exclusion',
        title: '游戏排挤',
        category: '社交排斥',
        difficulty: '中等',
        description: '在课间游戏中，你看到几个学生故意不让一个学生参与游戏，说他"太笨了"。',
        completed: true
      },
      {
        id: 'name_calling',
        title: '恶意取绰号',
        category: '言语欺凌',
        difficulty: '中等',
        description: '班上有几个同学总是叫小红"四眼妹"，还模仿她说话的样子，让她很难过。',
        completed: false
      },
      {
        id: 'public_humiliation',
        title: '公开羞辱',
        category: '言语欺凌',
        difficulty: '困难',
        description: '在全班面前，有同学大声嘲笑小李的家庭背景，说一些很伤人的话。',
        completed: false
      },
      {
        id: 'online_rumors',
        title: '网络谣言',
        category: '网络欺凌',
        difficulty: '简单',
        description: '你发现班级群里有人在传播关于某个同学的不实谣言，很多人都在转发。',
        completed: false
      },
      {
        id: 'physical_push',
        title: '推搡威胁',
        category: '身体欺凌',
        difficulty: '困难',
        description: '在走廊里，你看到几个高年级学生在推搡一个低年级同学，威胁要打他。',
        completed: false
      },
      {
        id: 'money_extortion',
        title: '勒索钱财',
        category: '财物欺凌',
        difficulty: '中等',
        description: '你听说有同学被要求每天交"保护费"，不交就会被欺负。',
        completed: false
      }
    ];
  }

  // Fisher-Yates 随机打乱算法
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 混合随机排序：前面保证有简单场景，中间完全随机
  mixedRandomSort(incompleteScenarios) {
    if (incompleteScenarios.length === 0) {
      return [];
    }

    // 按难度分组
    const easyScenarios = incompleteScenarios.filter(s => s.difficulty === '简单');
    const mediumScenarios = incompleteScenarios.filter(s => s.difficulty === '中等');
    const hardScenarios = incompleteScenarios.filter(s => s.difficulty === '困难');

    // 确保前面有1-2个简单场景（如果有的话）
    const frontEasyCount = Math.min(easyScenarios.length, 2);
    const frontEasy = easyScenarios.slice(0, frontEasyCount);
    const remainingEasy = easyScenarios.slice(frontEasyCount);

    // 剩余场景完全随机排序
    const randomPart = [...remainingEasy, ...mediumScenarios, ...hardScenarios];
    this.shuffleArray(randomPart);

    // 合并：前面的简单场景 + 随机排序的剩余场景
    return [...frontEasy, ...randomPart];
  }

  // 重置到第一个未完成的场景
  resetToFirstIncomplete() {
    // 找到第一个未完成的场景
    const firstIncompleteIndex = this.scenarios.findIndex(scenario => !scenario.completed);
    
    // 如果有未完成的场景，跳转到第一个未完成的场景
    if (firstIncompleteIndex !== -1) {
      this.currentIndex = firstIncompleteIndex;
    } else {
      // 如果所有场景都完成了，保持在第一个场景
      this.currentIndex = 0;
    }
  }

  init() {
    this.bindEvents();
  }

  render() {
    return `
      <div class="card-carousel-container">
        <div class="carousel-header">
          <div class="carousel-title">选择你的挑战</div>
          <div class="carousel-subtitle">左右滑动或使用方向键切换场景</div>
        </div>
        
        <div class="keyboard-hint">
          使用 ← → 方向键或滑动切换场景
        </div>
        
        <div class="card-carousel">
          <div class="carousel-track">
            ${this.scenarios.map((scenario, index) => this.renderCard(scenario, index)).join('')}
          </div>
        </div>
        
        <div class="carousel-indicators">
          ${this.scenarios.map((_, index) => `
            <div class="indicator-dot ${index === this.currentIndex ? 'active' : ''}" 
                 data-index="${index}" onclick="cardCarousel.goToSlide(${index})"></div>
          `).join('')}
        </div>
        
        <div class="carousel-navigation">
          <button class="nav-button" onclick="cardCarousel.prev()" ${this.currentIndex === 0 ? 'disabled' : ''}>
            ←
          </button>
          <div class="carousel-counter">
            ${this.currentIndex + 1} / ${this.scenarios.length}
          </div>
          <button class="nav-button" onclick="cardCarousel.next()" ${this.currentIndex === this.scenarios.length - 1 ? 'disabled' : ''}>
            →
          </button>
        </div>
        
        <div class="swipe-hint left">← 上一个</div>
        <div class="swipe-hint right">下一个 →</div>
      </div>
    `;
  }

  renderCard(scenario, index) {
    let positionClass = 'hidden';

    if (index === this.currentIndex) {
      positionClass = 'active';
    } else if (index === this.currentIndex - 1) {
      positionClass = 'prev';
    } else if (index === this.currentIndex + 1) {
      positionClass = 'next';
    }

    const difficultyClass = this.getDifficultyClass(scenario.difficulty);
    const statusClass = scenario.completed ? 'completed' : 'new';

    return `
      <div class="scenario-card carousel-card no-image ${difficultyClass} ${statusClass} ${positionClass}" 
           data-scenario-id="${scenario.id}" data-index="${index}">
        <div class="scenario-header">
          <div class="scenario-title">${scenario.title}</div>
          <div class="scenario-meta">
            <span class="game-badge ${this.getDifficultyBadgeClass(scenario.difficulty)}">${scenario.difficulty}</span>
            <span class="game-badge">${scenario.category}</span>
          </div>
        </div>
        
        <div class="scenario-description">
          ${scenario.description}
        </div>
        
        <div class="scenario-actions">
          ${scenario.completed ?
        `<div class="completed-status">
              <span class="game-icon icon-small">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </span>
              已完成
            </div>` :
        `<button class="start-btn difficulty-${difficultyClass}" 
                     onclick="cardCarousel.startScenario('${scenario.id}')">
              开始挑战
            </button>`
      }
        </div>
      </div>
    `;
  }

  bindEvents() {
    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });

    // 触摸事件
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

    // 鼠标事件（用于桌面端拖拽）
    document.addEventListener('mousedown', this.handleMouseStart.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseEnd.bind(this));
  }

  handleTouchStart(e) {
    if (!e.target.closest('.carousel-card')) return;

    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.isDragging = true;

    const activeCard = document.querySelector('.carousel-card.active');
    if (activeCard) {
      activeCard.classList.add('dragging');
    }
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - this.touchStartX;
    const deltaY = touchY - this.touchStartY;

    // 如果垂直滑动距离大于水平滑动，不处理
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    const activeCard = document.querySelector('.carousel-card.active');
    if (activeCard && Math.abs(deltaX) > 10) {
      const rotation = deltaX * 0.1;
      activeCard.style.transform = `translateX(${deltaX * 0.5}px) rotate(${rotation}deg)`;

      // 显示滑动提示
      if (deltaX > 50) {
        document.querySelector('.swipe-hint.right').classList.add('show');
        document.querySelector('.swipe-hint.left').classList.remove('show');
      } else if (deltaX < -50) {
        document.querySelector('.swipe-hint.left').classList.add('show');
        document.querySelector('.swipe-hint.right').classList.remove('show');
      } else {
        document.querySelectorAll('.swipe-hint').forEach(hint => hint.classList.remove('show'));
      }
    }
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;

    const touchX = e.changedTouches[0].clientX;
    const deltaX = touchX - this.touchStartX;

    const activeCard = document.querySelector('.carousel-card.active');
    if (activeCard) {
      activeCard.classList.remove('dragging');
      activeCard.style.transform = '';
    }

    // 隐藏滑动提示
    document.querySelectorAll('.swipe-hint').forEach(hint => hint.classList.remove('show'));

    // 判断滑动方向
    if (Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        this.prev();
      } else {
        this.next();
      }
    }

    this.isDragging = false;
  }

  handleMouseStart(e) {
    if (!e.target.closest('.carousel-card')) return;

    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
    this.isDragging = true;

    const activeCard = document.querySelector('.carousel-card.active');
    if (activeCard) {
      activeCard.classList.add('dragging');
    }
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.touchStartX;
    const deltaY = e.clientY - this.touchStartY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    const activeCard = document.querySelector('.carousel-card.active');
    if (activeCard && Math.abs(deltaX) > 10) {
      const rotation = deltaX * 0.1;
      activeCard.style.transform = `translateX(${deltaX * 0.5}px) rotate(${rotation}deg)`;

      if (deltaX > 50) {
        document.querySelector('.swipe-hint.right').classList.add('show');
        document.querySelector('.swipe-hint.left').classList.remove('show');
      } else if (deltaX < -50) {
        document.querySelector('.swipe-hint.left').classList.add('show');
        document.querySelector('.swipe-hint.right').classList.remove('show');
      } else {
        document.querySelectorAll('.swipe-hint').forEach(hint => hint.classList.remove('show'));
      }
    }
  }

  handleMouseEnd(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.touchStartX;

    const activeCard = document.querySelector('.carousel-card.active');
    if (activeCard) {
      activeCard.classList.remove('dragging');
      activeCard.style.transform = '';
    }

    document.querySelectorAll('.swipe-hint').forEach(hint => hint.classList.remove('show'));

    if (Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        this.prev();
      } else {
        this.next();
      }
    }

    this.isDragging = false;
  }

  prev() {
    if (this.isAnimating || this.currentIndex === 0) return;

    this.isAnimating = true;
    this.currentIndex--;
    this.updateCards('left');

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  next() {
    if (this.isAnimating || this.currentIndex === this.scenarios.length - 1) return;

    this.isAnimating = true;
    this.currentIndex++;
    this.updateCards('right');

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;

    this.isAnimating = true;
    const direction = index > this.currentIndex ? 'right' : 'left';
    this.currentIndex = index;
    this.updateCards(direction);

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  updateCards(direction) {
    const cards = document.querySelectorAll('.carousel-card');

    cards.forEach((card, index) => {
      // 移除所有位置类
      card.classList.remove('active', 'prev', 'next', 'hidden', 'slide-in-left', 'slide-in-right');

      // 添加新的位置类
      if (index === this.currentIndex) {
        card.classList.add('active');
        if (direction) {
          card.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
        }
      } else if (index === this.currentIndex - 1) {
        card.classList.add('prev');
      } else if (index === this.currentIndex + 1) {
        card.classList.add('next');
      } else {
        card.classList.add('hidden');
      }
    });

    // 更新指示器
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });

    // 更新导航按钮
    const prevBtn = document.querySelector('.nav-button:first-child');
    const nextBtn = document.querySelector('.nav-button:last-child');

    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.scenarios.length - 1;

    // 更新计数器
    const counter = document.querySelector('.carousel-counter');
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.scenarios.length}`;
    }
  }

  startScenario(scenarioId) {
    // 调用游戏引擎的场景启动逻辑
    if (window.gameEngine) {
      window.gameEngine.startScenario(scenarioId);
    } else {
      const scenario = this.scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        alert(`开始挑战: ${scenario.title}`);
      }
    }
  }

  getDifficultyClass(difficulty) {
    const classes = {
      '简单': 'easy',
      '中等': 'medium',
      '困难': 'hard'
    };
    return classes[difficulty] || 'easy';
  }

  getDifficultyBadgeClass(difficulty) {
    const classes = {
      '简单': 'secondary',
      '中等': 'warning',
      '困难': 'danger'
    };
    return classes[difficulty] || 'secondary';
  }

  // 获取当前场景
  getCurrentScenario() {
    return this.scenarios[this.currentIndex];
  }

  // 标记场景为已完成（只更新数据状态）
  markScenarioCompleted(scenarioId) {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      scenario.completed = true;
      
      // 只更新当前显示的卡片状态，不重新渲染整个轮播
      this.updateCurrentCardCompletionStatus(scenarioId);
    }
  }

  // 更新当前卡片的完成状态（无动画版本）
  updateCurrentCardCompletionStatus(scenarioId) {
    const currentCard = document.querySelector('.carousel-card.active');
    if (currentCard && currentCard.dataset.scenarioId === scenarioId) {
      // 添加完成状态类
      currentCard.classList.add('completed');
      
      // 更新按钮区域
      const actionsDiv = currentCard.querySelector('.scenario-actions');
      if (actionsDiv) {
        actionsDiv.innerHTML = `
          <div class="completed-status">
            <span class="game-icon icon-small">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </span>
            已完成
          </div>
        `;
      }
    }
  }

  // 平滑更新当前卡片状态
  updateCurrentCardStatus() {
    const currentCard = document.querySelector('.carousel-card.active');
    if (currentCard) {
      const scenario = this.scenarios[this.currentIndex];
      
      if (scenario.completed && !currentCard.classList.contains('completed')) {
        this.animateCardCompletion(currentCard);
      }
    }
  }

  // 动画显示卡片完成状态
  animateCardCompletion(card) {
    // 添加完成动画类
    card.classList.add('completing');
    
    // 更新按钮区域
    const actionsDiv = card.querySelector('.scenario-actions');
    if (actionsDiv) {
      // 淡出当前按钮
      actionsDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      actionsDiv.style.opacity = '0';
      actionsDiv.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        // 更新内容
        actionsDiv.innerHTML = `
          <div class="completed-status">
            <span class="game-icon icon-small">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </span>
            已完成
          </div>
        `;
        
        // 淡入新内容
        actionsDiv.style.opacity = '1';
        actionsDiv.style.transform = 'translateY(0)';
      }, 300);
    }
    
    // 更新卡片样式
    setTimeout(() => {
      card.classList.remove('completing');
      card.classList.add('completed');
      
      // 添加成功动画效果
      card.style.animation = 'completionPulse 0.6s ease-out';
      
      setTimeout(() => {
        card.style.animation = '';
      }, 600);
    }, 600);
  }

  refreshCurrentCard() {
    const currentCard = document.querySelector('.carousel-card.active');
    if (currentCard) {
      const scenario = this.scenarios[this.currentIndex];
      const newCardHtml = this.renderCard(scenario, this.currentIndex);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newCardHtml;
      const newCard = tempDiv.firstElementChild;

      currentCard.parentNode.replaceChild(newCard, currentCard);
    }
  }

  // 执行平滑排序
  performSmoothResorting(callback) {
    if (!this.needsResorting) {
      if (callback) callback();
      return;
    }
    
    const container = document.getElementById('scenario-carousel-container');
    if (!container) {
      if (callback) callback();
      return;
    }
    
    // 添加淡出动画
    container.style.transition = 'opacity 0.4s ease';
    container.style.opacity = '0.3';
    
    setTimeout(() => {
      // 重新排序和更新场景数据
      this.updateScenariosWithUserData();
      
      // 重新渲染整个轮播
      container.innerHTML = this.render();
      
      // 更新卡片显示状态
      this.updateCards();
      
      // 重新绑定事件
      this.bindEvents();
      
      // 淡入动画
      container.style.opacity = '1';
      
      // 清除排序标记
      this.needsResorting = false;
      
      setTimeout(() => {
        // 移除过渡效果
        container.style.transition = '';
        
        // 执行回调
        if (callback) callback();
      }, 400);
    }, 200);
  }

  // 刷新所有卡片状态（用于场景完成后更新）
  refreshAllCards() {
    // 重新排序和更新场景数据
    this.updateScenariosWithUserData();
    
    const container = document.getElementById('scenario-carousel-container');
    if (container) {
      // 重新渲染整个轮播
      container.innerHTML = this.render();
      
      // 更新卡片显示状态
      this.updateCards();
      
      // 重新绑定事件（因为DOM重新生成了）
      this.bindEvents();
    }
  }

  // 全局方法：供游戏引擎调用更新卡片状态
  static refreshCarousel() {
    if (window.cardCarousel) {
      window.cardCarousel.refreshAllCards();
    }
  }
}

// 创建全局实例
window.cardCarousel = null;
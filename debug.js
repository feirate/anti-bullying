// 调试工具 - 在浏览器控制台中运行
window.debugTools = {
  // 检查游戏状态
  checkGameState() {
    console.log('=== 游戏状态检查 ===');
    console.log('window.gameData:', window.gameData);
    console.log('window.userSystem:', window.userSystem);
    console.log('window.gameEngine:', window.gameEngine);
    console.log('用户数据:', window.userSystem?.user);
    console.log('当前场景:', window.gameEngine?.currentScenario);
  },

  // 检查DOM元素
  checkDOM() {
    console.log('=== DOM元素检查 ===');
    console.log('app元素:', document.getElementById('app'));
    console.log('loading元素:', document.getElementById('loading'));
    console.log('body内容长度:', document.body.innerHTML.length);
  },

  // 检查静态资源
  checkResources() {
    console.log('=== 静态资源检查 ===');
    const resources = [
      'css/doodle-style.css',
      'js/user-system.js',
      'js/game-engine.js',
      'js/supabase-client.js',
      'js/main.js',
      'data/scenarios.json',
      'data/contact-info.json'
    ];
    
    resources.forEach(resource => {
      fetch(resource)
        .then(response => {
          console.log(`✅ ${resource}: ${response.status}`);
        })
        .catch(error => {
          console.error(`❌ ${resource}: ${error.message}`);
        });
    });
  },

  // 重置用户数据
  resetUser() {
    localStorage.removeItem('bgh_user');
    console.log('✅ 用户数据已重置');
    location.reload();
  },

  // 模拟用户创建
  createTestUser(grade = 3) {
    const testUser = {
      uuid: 'test-user-' + Date.now(),
      grade: grade,
      empathy: 5,
      courage: 3,
      wisdom: 4,
      completed_scenarios: [],
      achievements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem('bgh_user', JSON.stringify(testUser));
    console.log('✅ 测试用户已创建:', testUser);
    location.reload();
  },

  // 显示所有可用方法
  help() {
    console.log('=== 调试工具使用方法 ===');
    console.log('debugTools.checkGameState() - 检查游戏状态');
    console.log('debugTools.checkDOM() - 检查DOM元素');
    console.log('debugTools.checkResources() - 检查静态资源');
    console.log('debugTools.resetUser() - 重置用户数据');
    console.log('debugTools.createTestUser(grade) - 创建测试用户');
    console.log('debugTools.help() - 显示此帮助信息');
  }
};

// 自动显示帮助信息
console.log('🔧 调试工具已加载！输入 debugTools.help() 查看使用方法'); 
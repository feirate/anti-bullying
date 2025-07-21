// 主程序入口
document.addEventListener('DOMContentLoaded', function() {
  console.log('Anti-Bullying 游戏启动中...');
  
  // 初始化全局游戏数据
  window.gameData = null;
  
  // 等待用户系统初始化完成
  setTimeout(() => {
    if (window.userSystem && window.userSystem.user) {
      console.log('用户已登录，开始游戏');
      window.gameEngine.startGame();
    } else {
      console.log('等待用户选择年级...');
    }
  }, 1000);
});

// 全局函数：开始游戏
function startGame() {
  if (window.gameEngine) {
    window.gameEngine.startGame();
  }
}

// 全局函数：复制用户ID
function copyUserID() {
  const user = window.userSystem?.user;
  if (user && user.uuid) {
    navigator.clipboard.writeText(user.uuid).then(() => {
      alert('用户ID已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制：' + user.uuid);
    });
  }
}

// 全局函数：查询成就
function queryAchievements() {
  const userID = prompt('请输入你的用户ID：');
  if (userID) {
    // TODO: 实现成就查询功能
    console.log('查询用户ID:', userID);
    alert('成就查询功能开发中...');
  }
}

// 错误处理
window.addEventListener('error', function(e) {
  console.error('游戏错误:', e.error);
  const errorContainer = document.getElementById('app');
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="doodle-container">
        <div class="doodle-title">游戏出错了</div>
        <div class="error-message">
          抱歉，游戏遇到了问题。请刷新页面重试。
        </div>
        <button class="doodle-btn" onclick="location.reload()">刷新页面</button>
      </div>
    `;
  }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    console.log('页面重新可见，刷新用户数据');
    if (window.userSystem) {
      window.userSystem.loadUser();
    }
  }
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
  // ESC键返回主菜单
  if (e.key === 'Escape') {
    if (window.gameEngine) {
      window.gameEngine.showMainMenu();
    }
  }
  
  // Ctrl+R 刷新页面
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    location.reload();
  }
});

console.log('主程序加载完成'); 
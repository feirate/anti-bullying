# 成就系统算法设计

## 数据结构

```javascript
// 用户数据结构
User {
  uuid: string,                    // 唯一标识符
  empathy: number,                 // 同理心点数
  courage: number,                 // 勇气点数
  wisdom: number,                  // 智慧点数
  completed_scenarios: string[],   // 已完成的场景ID列表
  achievements: string[],          // 已解锁的成就ID列表
  created_at: timestamp,           // 创建时间
  updated_at: timestamp            // 更新时间
}

// 场景选择结果
ChoiceResult {
  scenario_id: string,             // 场景ID
  choice_id: string,               // 选择ID
  points_earned: {                 // 获得的点数
    empathy: number,
    courage: number,
    wisdom: number
  },
  timestamp: timestamp             // 选择时间
}
```

## 核心算法

### 1. 点数计算算法

```javascript
function calculatePoints(user, choice) {
  // 更新用户点数
  user.empathy += choice.points.empathy;
  user.courage += choice.points.courage;
  user.wisdom += choice.points.wisdom;
  
  // 确保点数不为负数
  user.empathy = Math.max(0, user.empathy);
  user.courage = Math.max(0, user.courage);
  user.wisdom = Math.max(0, user.wisdom);
  
  return user;
}
```

### 2. 成就检查算法

```javascript
function checkAchievements(user, scenarios, achievements) {
  let newAchievements = [];
  
  for (let achievement of achievements) {
    // 跳过已解锁的成就
    if (user.achievements.includes(achievement.id)) {
      continue;
    }
    
    // 检查成就条件
    if (evaluateCondition(user, achievement.condition)) {
      newAchievements.push(achievement);
      user.achievements.push(achievement.id);
    }
  }
  
  return {
    user: user,
    newAchievements: newAchievements
  };
}
```

### 3. 条件评估算法

```javascript
function evaluateCondition(user, condition) {
  // 解析条件字符串
  const conditions = {
    'completed_scenarios': user.completed_scenarios.length,
    'empathy': user.empathy,
    'courage': user.courage,
    'wisdom': user.wisdom
  };
  
  // 替换条件字符串中的变量
  let evalCondition = condition;
  for (let [key, value] of Object.entries(conditions)) {
    evalCondition = evalCondition.replace(new RegExp(key, 'g'), value);
  }
  
  // 安全评估条件
  try {
    return eval(evalCondition);
  } catch (error) {
    console.error('条件评估错误:', error);
    return false;
  }
}
```

### 4. 场景完成算法

```javascript
function completeScenario(user, scenarioId, choiceId) {
  // 获取场景和选择数据
  const scenario = getScenarioById(scenarioId);
  const choice = getChoiceById(scenario, choiceId);
  
  // 计算点数
  user = calculatePoints(user, choice);
  
  // 添加到已完成场景列表
  if (!user.completed_scenarios.includes(scenarioId)) {
    user.completed_scenarios.push(scenarioId);
  }
  
  // 检查新成就
  const achievementResult = checkAchievements(user, scenarios, achievements);
  
  // 更新用户数据
  user.updated_at = new Date();
  
  return {
    user: achievementResult.user,
    pointsEarned: choice.points,
    feedback: choice.feedback,
    learningMoment: scenario.learning_moment,
    newAchievements: achievementResult.newAchievements
  };
}
```

### 5. 等级计算算法

```javascript
function calculateLevel(user) {
  const totalPoints = user.empathy + user.courage + user.wisdom;
  
  if (totalPoints >= 30) return 5;
  if (totalPoints >= 20) return 4;
  if (totalPoints >= 15) return 3;
  if (totalPoints >= 10) return 2;
  return 1;
}
```

### 6. 进度计算算法

```javascript
function calculateProgress(user) {
  const totalScenarios = 4; // 总场景数
  const completedScenarios = user.completed_scenarios.length;
  
  return {
    scenariosProgress: (completedScenarios / totalScenarios) * 100,
    levelProgress: calculateLevelProgress(user),
    achievementsProgress: (user.achievements.length / 6) * 100 // 总成就数
  };
}

function calculateLevelProgress(user) {
  const currentLevel = calculateLevel(user);
  const pointsForCurrentLevel = getPointsForLevel(currentLevel);
  const pointsForNextLevel = getPointsForLevel(currentLevel + 1);
  const userTotalPoints = user.empathy + user.courage + user.wisdom;
  
  if (currentLevel >= 5) return 100;
  
  const progress = ((userTotalPoints - pointsForCurrentLevel) / 
                   (pointsForNextLevel - pointsForCurrentLevel)) * 100;
  
  return Math.min(100, Math.max(0, progress));
}

function getPointsForLevel(level) {
  const levelPoints = {
    1: 0,
    2: 10,
    3: 15,
    4: 20,
    5: 30
  };
  return levelPoints[level] || 0;
}
```

## 数据持久化

### 1. 本地存储

```javascript
function saveUserData(user) {
  localStorage.setItem('user_uuid', user.uuid);
  localStorage.setItem('user_data', JSON.stringify(user));
}

function loadUserData() {
  const uuid = localStorage.getItem('user_uuid');
  const userData = localStorage.getItem('user_data');
  
  if (uuid && userData) {
    return JSON.parse(userData);
  }
  
  return null;
}
```

### 2. Supabase 存储

```javascript
async function saveToSupabase(user) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      uuid: user.uuid,
      empathy: user.empathy,
      courage: user.courage,
      wisdom: user.wisdom,
      completed_scenarios: user.completed_scenarios,
      achievements: user.achievements,
      updated_at: new Date().toISOString()
    });
  
  return { data, error };
}

async function loadFromSupabase(uuid) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uuid', uuid)
    .single();
  
  return { data, error };
}
```

## 使用示例

```javascript
// 用户完成场景
const result = completeScenario(user, 'lunch_table', 'sit_with');

console.log('获得的点数:', result.pointsEarned);
console.log('反馈信息:', result.feedback);
console.log('学习要点:', result.learningMoment);
console.log('新解锁成就:', result.newAchievements);

// 保存数据
saveUserData(result.user);
saveToSupabase(result.user);
``` 
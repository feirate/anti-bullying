// Supabase 客户端配置
// 注意：实际的API密钥通过环境变量获取，不会硬编码在代码中

class SupabaseClient {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.init();
  }

  // 初始化Supabase客户端
  async init() {
    try {
      // 从环境变量获取配置
      const supabaseUrl = this.getEnvironmentVariable('SUPABASE_URL');
      const supabaseKey = this.getEnvironmentVariable('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase配置未找到，使用本地存储模式');
        this.isInitialized = false;
        return;
      }

      // 使用本地安装的Supabase客户端
      // 执行: npm install @supabase/supabase-js
      if (typeof window.supabase === 'undefined') {
        console.error('Supabase客户端库未加载，请确保已正确引入');
        throw new Error('Supabase客户端库未找到');
      }
      const { createClient } = window.supabase;
      this.client = createClient(supabaseUrl, supabaseKey);
      
      this.isInitialized = true;
      console.log('Supabase客户端初始化成功');
      
      // 测试连接
      await this.testConnection();
      
    } catch (error) {
      console.error('Supabase客户端初始化失败:', error);
      this.isInitialized = false;
    }
  }

  // 获取环境变量
  getEnvironmentVariable(key) {
    // 使用CoreUtils，如果不可用则使用内联实现
    if (window.CoreUtils) {
      return CoreUtils.getEnvVar(key);
    }
    
    // 降级实现
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
    
    const metaTag = document.querySelector(`meta[name="${key}"]`);
    if (metaTag) {
      const value = metaTag.getAttribute('content');
      if (value && !value.includes('your_') && !value.includes('_here')) {
        return value;
      }
    }
    
    if (window.ENV && window.ENV[key]) {
      const value = window.ENV[key];
      if (value && !value.includes('your_') && !value.includes('_here')) {
        return value;
      }
    }
    
    return '';
  }

  // 测试连接
  async testConnection() {
    if (!this.isInitialized) {
      console.log('Supabase未初始化，跳过连接测试');
      return false;
    }

    try {
      const { error } = await this.client
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Supabase连接测试失败:', error);
        return false;
      }
      
      console.log('Supabase连接测试成功');
      return true;
    } catch (error) {
      console.error('Supabase连接测试异常:', error);
      return false;
    }
  }

  // 保存用户数据
  async saveUser(userData) {
    if (!this.isInitialized) {
      console.log('Supabase未初始化，使用本地存储');
      return this.saveToLocalStorage(userData);
    }

    try {
      const { error } = await this.client
        .from('users')
        .upsert(userData, { onConflict: 'uuid' });
      
      if (error) {
        console.error('保存用户数据失败:', error);
        return this.saveToLocalStorage(userData);
      }
      
      console.log('用户数据保存成功');
      return true;
    } catch (error) {
      console.error('保存用户数据异常:', error);
      return this.saveToLocalStorage(userData);
    }
  }

  // 获取用户数据
  async getUser(uuid) {
    if (!this.isInitialized) {
      console.log('Supabase未初始化，从本地存储获取');
      return this.getFromLocalStorage(uuid);
    }

    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('uuid', uuid)
        .single();
      
      if (error) {
        console.error('获取用户数据失败:', error);
        return this.getFromLocalStorage(uuid);
      }
      
      console.log('用户数据获取成功');
      return data;
    } catch (error) {
      console.error('获取用户数据异常:', error);
      return this.getFromLocalStorage(uuid);
    }
  }

  // 本地存储备用方案
  saveToLocalStorage(userData) {
    let success = false;
    
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      success = CoreUtils.storage.set('bgh_user', userData);
    } else {
      try {
        localStorage.setItem('bgh_user', JSON.stringify(userData));
        success = true;
      } catch (e) {
        console.warn('保存到本地存储失败:', e);
        success = false;
      }
    }
    
    if (success) {
      console.log('用户数据已保存到本地存储');
    }
    return success;
  }

  getFromLocalStorage(uuid) {
    let userData = null;
    
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      userData = CoreUtils.storage.get('bgh_user');
    } else {
      try {
        const item = localStorage.getItem('bgh_user');
        userData = item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('读取本地存储失败:', e);
        userData = null;
      }
    }
    
    if (userData && userData.uuid === uuid) {
      console.log('从本地存储获取用户数据');
      return userData;
    }
    return null;
  }

  // 获取用户统计信息
  async getUserStats() {
    if (!this.isInitialized) {
      console.log('Supabase未初始化，无法获取统计信息');
      return null;
    }

    try {
      const { data, error } = await this.client
        .from('users')
        .select('grade, empathy, courage, wisdom, completed_scenarios');
      
      if (error) {
        console.error('获取统计信息失败:', error);
        return null;
      }
      
      return this.calculateStats(data);
    } catch (error) {
      console.error('获取统计信息异常:', error);
      return null;
    }
  }

  // 计算统计信息
  calculateStats(users) {
    if (!users || users.length === 0) {
      return null;
    }

    const stats = {
      totalUsers: users.length,
      totalScenarios: 0,
      averageEmpathy: 0,
      averageCourage: 0,
      averageWisdom: 0,
      gradeDistribution: {}
    };

    let totalEmpathy = 0;
    let totalCourage = 0;
    let totalWisdom = 0;

    users.forEach(user => {
      totalEmpathy += user.empathy || 0;
      totalCourage += user.courage || 0;
      totalWisdom += user.wisdom || 0;
      stats.totalScenarios += user.completed_scenarios?.length || 0;
      
      const grade = user.grade;
      stats.gradeDistribution[grade] = (stats.gradeDistribution[grade] || 0) + 1;
    });

    stats.averageEmpathy = Math.round(totalEmpathy / users.length);
    stats.averageCourage = Math.round(totalCourage / users.length);
    stats.averageWisdom = Math.round(totalWisdom / users.length);

    return stats;
  }
}

// 全局Supabase客户端实例
window.supabaseClient = new SupabaseClient(); 
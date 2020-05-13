/*
 * @Author: vuvivian
 * @Date: 2020-05-13 20:31:46
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-05-13 22:31:59
 * @Descripttion: 基于proxy实现mini响应式
 * @FilePath: /vue-source/vue3-proxy/proxy.js
 */

 // 原始 => 响应式 存储
 let  toProxy = new WeakMap();
 
 // 响应式 => 原始 存储
 let toRow = new WeakMap();

 // 存储effect的地方
 let effectStack = []; 

 // 特殊的对象 key是object
 let targetMap = new WeakMap()  

//  {
//    target: deps: []
//  }

 // 以上存储依赖关系
  
  // 6 收集依赖
  function track (target, key) {
    // 获取最新的effect
    const effect = effectStack[effectStack.length-1]

    if (effect) {
      let depMap = targetMap.get(target)
      if (depMap === undefined) {
        depMap = new Map()
        targetMap.set(target, depMap)
      }

      let dep = depMap.get(key) 
      if (dep === undefined) {
        dep = new Set()
        depMap.set(key, dep)
      }

      if (!dep.has(effect)) {
        dep.add(effect)
        effect.deps.push(dep)
      }
    }
  };

  // 7 触发更新
  function trigger(target, key, info){
    // 寻找依赖函数
    const depMap = targetMap.get(target);

    // 没有依赖
    if (depMap === undefined) {
      return 
    }

    const effects = new Set()
    const computedRunners = new Set()

    if (key) {
      let deps = depMap.get(key);
      deps.forEach(effect => {
        if (effect.computed) {
          computedRunners.add(effect)
        }  else {
          effects.add(effects)
        }
      });
    }
  };

  // 3
  function effect(fn, options={}){
    // 其实就是往effectStack中push 　一个effect函数，执行fn
    let e = creatReactiveEffect(fn, options);

    if (!options.lazy) {
      e()
    }
    return e;
  };

  // 4 构造新的efect
  function creatReactiveEffect (fn, options) {
    const effect = function effect(...args){
      return run(effect, fn, args);
    }
    effect.deps = [];
    effect.computed = options.computed
    effect.lazy = options.lazy
    return effect
  };

  // 5 查看effect是否存在
  function run (effect, fn, args) {
    if (effectStack.indexOf(effect) === -1) {
      try {
        effectStack.push(effect)
        return fn(...args)
      } finally{
        effectStack.pop() // efffect用完就要推出去
      }
    }
  }
  
  // 特殊的effect
  function computed(fn) {
    const runer = effect(fn, {computed: true, lazy: true})
    return ({
      effect: runer,
      get value (){
        return runer()
      }
    })
  };


  // let obj = {name: 'kkb'} //背后有一个proxy监听 响应式

 // obj.name 触发get
 // 响应式代理
 const baseHandle = {
  get(target, key) {
    // 收集依赖
    // target是对象， key是name

    const res = Reflect.get(target, key);
    track(target,key);

    return typeof res === 'object' ? reactive(res):res
  },
  set(target, key){

    const info = {oldValue:target[key], newValue:val};
    // obj.name = xx 这里需要通知更新的
    const res = Reflect.set(target, key, val);
    // 触发更新
    trigger(target, key, info);
    return res;
  }
 };
 
 // 响应式 入口
 function reactive(target){

  // 查询缓存
  let observer = toProxy.get(target);

  if (observer) {
    return observer;
  }

  if(toRow.get(target)){
    return target
  }

  observer = new Proxy(target, baseHandle);

  // 设置缓存
  toProxy.set(target, observer)
  toRow.set(target, observer) // ???
  return observer;

 }
 
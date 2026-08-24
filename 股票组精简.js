// 股票组精简：从 143 条精简到 52 条
const fs = require('fs');
const path = require('path');

// 精简后的 52 条（按子主题分组）
const slimTopics = [
  // 基础概念 6
  '股票 | 公司发行的所有权凭证。',
  'A股 | 人民币普通股票，境内交易。',
  'IPO | 公司首次公开募股上市。',
  '市值 | 股价乘以总股本。',
  '股东 | 持有公司股份的人。',
  '上市公司 | 股票在交易所公开交易的公司。',
  // 行情术语 8
  '开盘价 | 交易日第一笔成交价。',
  '收盘价 | 交易日最后一笔成交价。',
  '成交量 | 一定时间内成交的股票数。',
  '换手率 | 当日成交量占流通股本的比例。',
  '涨跌幅 | 当日股价涨跌的百分比。',
  '涨停 | 涨到当日上限无法再涨。',
  '跌停 | 跌到当日下限无法再跌。',
  'K线 | 记录股价走势的蜡烛图。',
  // 技术指标 6
  '均线 | 一段时间的平均价格连线。',
  'MACD | 看趋势和买卖点的指标。',
  'KDJ | 短期超买超卖指标。',
  'RSI | 衡量涨跌力度的相对强弱指标。',
  '金叉 | 短期均线上穿长期均线看涨。',
  '死叉 | 短期均线下穿长期均线看跌。',
  // 投资策略 8
  '价值投资 | 找被低估的好公司长期持有。',
  '短线交易 | 几天内快进快出。',
  '中长线投资 | 持有数月到几年的投资。',
  '右侧交易 | 确认涨了再跟进的顺势操作。',
  '追涨杀跌 | 涨了跟着买跌了跟着卖。',
  '抄底 | 觉得是低点买入等待反弹。',
  '仓位 | 投资的钱占总资金的比例。',
  'T+1 | A股当天买入次日才能卖。',
  // 风险控制 6
  '止损 | 跌到一定价位认赔卖出。',
  '止盈 | 涨到一定价位落袋为安。',
  '套牢 | 买入后股价下跌被套住。',
  '补仓 | 下跌后继续买入降低成本。',
  '割肉 | 亏损卖出承认损失。',
  '分散投资 | 不把鸡蛋放一个篮子里。',
  // 公司基本面 7
  '财报 | 公司定期发布的财务报告。',
  '净利润 | 公司最终赚到的钱。',
  '营收 | 公司卖东西的总收入。',
  '毛利率 | 营收减去直接成本的比率。',
  '市盈率 | 股价与每股收益的比值。',
  '市净率 | 股价与每股净资产的比值。',
  '现金流 | 公司实际进出多少钱。',
  // 投资工具 5
  '基金 | 集合多人的钱由专人投资。',
  'ETF | 可以在交易所买卖的基金。',
  '指数基金 | 跟踪某个指数的基金。',
  '定投 | 定期定额买入摊平成本。',
  '融资融券 | 借钱买券或借券卖出的杠杆。',
  // 市场与情绪 6
  '牛市 | 持续上涨的市场。',
  '熊市 | 持续下跌的市场。',
  '震荡市 | 涨涨跌跌没有明显趋势。',
  '贪婪情绪 | 市场上涨时的集体狂热。',
  '恐慌情绪 | 市场下跌时的集体恐惧。',
  '接盘侠 | 高位买入被套的人。'
];

// 替换 index.html 中的 stock 词库
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 找到 stock 组的 topics 数组范围（从 `id: 'stock'` 到下一个 `id:` 之前）
const startMarker = `id: 'stock'`;
const startIdx = html.indexOf(startMarker);
if (startIdx === -1) { console.error('stock 组没找到'); process.exit(1); }
// 找到该组 topics 数组的 [ 和 ]
const afterStart = html.substring(startIdx);
const topicsOpen = afterStart.indexOf('[');
const topicsClose = afterStart.indexOf('];', topicsOpen);
const fullStockBlock = afterStart.substring(0, topicsClose + 2);

const newStockTopics = `topics: [\n${slimTopics.map(t => `            '${t.replace(/'/g, "\\'")}'`).join(',\n')}\n          ]`;
const newBlock = fullStockBlock.replace(/topics: \[[\s\S]*?\]/, newStockTopics);

html = html.replace(fullStockBlock, newBlock);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('股票组精简完成：' + slimTopics.length + ' 条');

// 删除 answers 目录下已经生成的 143 个股票答案文件（O 米之前没有生成，但要清理可能残留的）
// 注意：O 米之前没给 stock 写过答案文件，因为 stock 组是姐姐刚说要补的，现在还没生成
// 所以这里只检查有没有
const answerDir = path.join(__dirname, 'answers');
const existingFiles = fs.readdirSync(answerDir);
console.log('answers 目录现有文件数：' + existingFiles.length);

// 列出哪些文件标题在原始 stock 词条列表里，但现在不在精简列表里
const slimSet = new Set(slimTopics.map(t => t.split(' | ')[0]));
const originalTopics = [
  '股票','A股','B股','港股','美股','IPO','上市公司','股东','股本','市值','流通市值','总市值',
  '开盘价','收盘价','最高价','最低价','成交量','成交额','换手率','振幅','涨跌幅','涨停','跌停','高开','低开','平开',
  'K线','阳线','阴线','十字星','上影线','下影线',
  '均线','MA 均线','MACD','KDJ','RSI','BOLL 布林线','成交量指标','金叉','死叉','支撑位','压力位','趋势线',
  '价值投资','成长投资','短线交易','中长线投资','波段操作','T+1','T+0','左侧交易','右侧交易','追涨','杀跌','抄底','摸顶',
  '仓位','建仓','加仓','减仓','清仓','满仓','空仓','半仓',
  '止损','止盈','套牢','解套','补仓','割肉','分散投资','资产配置','风险偏好','盈亏比',
  '财报','年报','季报','净利润','营收','毛利率','市盈率','PE','市净率','PB','每股收益','净资产收益率','现金流','负债率','分红','股息率','回购','增持','减持',
  '蓝筹股','白马股','成长股','周期股','题材股','概念股','妖股','龙头股','板块','行业','赛道','黄金',
  '集合竞价','连续竞价','挂单','限价单','市价单','涨跌停板','ST 股','退市',
  '长期主义','复利效应','低买高卖','高抛低吸','逆向投资','定投','巴菲特','基本面','技术面','消息面','政策面','资金面',
  '牛市','熊市','猴市','震荡市','恐慌情绪','贪婪情绪','抄底资金','接盘侠',
  '基金','ETF','指数基金','主动基金','场外基金','场内基金','融资融券','北向资金','南向资金'
];

const removedTopics = originalTopics.filter(t => !slimSet.has(t));
console.log('\n=========');
console.log('【已精简】共保留 ' + slimTopics.length + ' 条，删除 ' + removedTopics.length + ' 条');
console.log('【删除明细】共 ' + removedTopics.length + ' 个词条未在精简列表中：');
removedTopics.forEach((t, i) => {
  if (i < 10 || i > removedTopics.length - 5) console.log('  - ' + t);
  else if (i === 10) console.log('  ...(中间省略 ' + (removedTopics.length - 15) + ' 条)');
});
console.log('=========');
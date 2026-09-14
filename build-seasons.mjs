/**
 * 节气食单 · 季节专栏页生成器
 * ----------------------------------------------------------
 * 从 index.html 抽取 SVG 图标 symbol（唯一真源），按同一模板生成
 * season-spring / summer / autumn / winter.html，每页含该季 6 个节气：
 * 由来与物候 + 食俗讲究 + 当令食材详解
 * 改完数据重新执行：node build-seasons.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'index.html');
const src = fs.readFileSync(SRC, 'utf8');

/* ---------- 图标库：从 index.html 抽取，避免两份定义走样 ---------- */
const SYMBOLS = {};
{
  const re = /<symbol id="(ic-[a-z]+)"[\s\S]*?<\/symbol>/g;
  let m;
  while ((m = re.exec(src))) SYMBOLS[m[1]] = m[0];
}
const iconCount = Object.keys(SYMBOLS).length;
if (iconCount < 20) {
  console.error('图标抽取异常，只拿到 ' + iconCount + ' 个');
  process.exit(1);
}
function symbolsFor(terms) {
  const ids = [...new Set(terms.flatMap((t) => t.foods.map((f) => f.icon)))];
  return ids.map((id) => {
    if (!SYMBOLS[id]) throw new Error('缺少图标：' + id);
    return '        ' + SYMBOLS[id];
  }).join('\n');
}

/* ================= 季节数据 ================= */
const CN_NO = ['壹', '贰', '叁', '肆', '伍', '陆'];
const SEASONS = [
  {
    key: 'spring', char: '春', name: '春 · 万物萌发', en: 'Spring', no: '01',
    tagline: '咬春尝鲜', sub: '一碟春芽，半城新绿',
    intro: [
      '春三月，此谓发陈。天地俱生，万物以荣——这是《黄帝内经》里对春天的判词，也是中国人餐桌的年度起笔。',
      '从立春到大寒是一圈，从立春到谷雨却是一年中最"鲜嫩"的九十天。此时节的食物讲究一个"生"字：芽、苗、笋、花，凡刚从土里钻出来的，都带有冬天蓄了一季的甜。',
    ],
    terms: [
      {
        name: '立春', en: 'Start of Spring', date: '2 月 3—5 日',
        origin: '二十四节气之首，"立"即开始。三候为「东风解冻、蛰虫始振、鱼陟负冰」——风暖了，土松了，河冰下藏了一冬的鱼开始往上浮。农谚说「立春一年端，种地早盘算」，春耕的账从这天开始算。',
        custom: '民间称"咬春"：把春饼卷成筒，从头吃到尾，取"有头有尾"的好彩头；再啃一口生萝卜，谓之"咬得草根断，则百事可做"。古时官府还有"打春牛"之礼，用泥塑春牛鞭之，劝农始耕。',
        foods: [
          { name: '春饼', en: 'Spring Pancake', icon: 'ic-cake', desc: '薄如蝉翼的烫面饼，卷上炒合菜——豆芽、韭菜、粉丝、肉丝同炒，一口咬下去是整座春天的杂陈。' },
          { name: '五辛盘', en: 'Five Pungents', icon: 'ic-greens', desc: '葱、蒜、韭、薤、姜五味同盘，辛味发散，借以疏通一冬郁积的阳气。' },
        ],
      },
      {
        name: '雨水', en: 'Rain Water', date: '2 月 18—20 日',
        origin: '降水开始，天上下的是雨不再是雪。三候「獭祭鱼、候雁北、草木萌动」：水獭把鱼摆在岸边像祭祀，大雁启程北归，草木在看不见的地方悄悄返青。',
        custom: '川西有"拉保保"认干亲的旧俗；已出嫁的女儿要给岳父母送"罐罐肉"——一罐砂锅慢煨的肉，用红纸封口、红绳扎紧，谢的是养育之恩。',
        foods: [
          { name: '罐罐肉', en: 'Clay-pot Pork', icon: 'ic-pot', desc: '猪脚或排骨加黄豆入砂锅，小火慢煨到脱骨。罐口一封，送到娘家的路上还是滚烫的。' },
          { name: '龙须饼', en: 'Dragon-whisker Pastry', icon: 'ic-cake', desc: '面条拉得细如龙须，油炸后压成饼，撒白糖。取的是"二月二龙抬头"前的一份彩头。' },
        ],
      },
      {
        name: '惊蛰', en: 'Awakening of Insects', date: '3 月 5—7 日',
        origin: '春雷始鸣，蛰伏了一冬的虫兽被雷声"惊"醒。三候「桃始华、仓庚鸣、鹰化为鸠」——桃花初开，黄鹂开嗓。天气转暖，也到了该防虫的时候。',
        custom: '民间"炒虫"：把黄豆、玉米、芝麻下锅爆炒，噼啪声象征把害虫炒死。陕西炒"棋子豆"，广东爆"炒黄豆"，孩子兜里装满，边走边吃。',
        foods: [
          { name: '炒虫豆', en: 'Fried "Insects"', icon: 'ic-greens', desc: '黄豆泡发晾干后干锅慢炒，直到裂口酥香。噼啪作响的锅里，炒的是虫，求的是苗。' },
          { name: '惊蛰梨', en: 'Pear', icon: 'ic-fruit', desc: '春燥伤肺，此时梨最润。更兼"梨"谐音"离"，吃一颗，寓意与病害害虫远远分离。' },
        ],
      },
      {
        name: '春分', en: 'Spring Equinox', date: '3 月 20—22 日',
        origin: '昼夜均，寒暑平。三候「玄鸟至、雷乃发声、始电」——燕子回来了，雷声夹着闪电。这一天南北半球昼夜等长，是春天真正站稳脚跟的一天。',
        custom: '岭南采野苋菜煮"春汤"，谓之"春汤灌脏，洗涤肝肠"；江南则"竖蛋"——据说春分这天蛋最容易立起来。',
        foods: [
          { name: '春笋', en: 'Spring Bamboo Shoot', icon: 'ic-bamboo', desc: '雨后破土的笋，鲜得能掐出水。油焖、炖腌笃鲜皆宜，讲究的是"当日挖当日吃"。' },
          { name: '荠菜馄饨', en: 'Shepherd\'s Purse Wonton', icon: 'ic-dumpling', desc: '田埂边挑来的荠菜剁碎拌肉，包成元宝状。一口下去，是野地里的清气。' },
        ],
      },
      {
        name: '清明', en: 'Pure Brightness', date: '4 月 4—6 日',
        origin: '既是节气，也是节日。三候「桐始华、田鼠化为鴽、虹始见」。气温回暖、雨水增多，正是"清明前后，种瓜点豆"的农忙时。',
        custom: '寒食禁火，故需提前备冷食——青团由此而生。人们扫墓、踏青、插柳、荡秋千，把哀思与春游放在同一天。',
        foods: [
          { name: '青团', en: 'Green Rice Ball', icon: 'ic-cake', desc: '艾草汁或麦青汁和上糯米粉，裹豆沙或芝麻馅，蒸熟后油绿如玉，凉吃更韧。' },
          { name: '清明螺', en: 'River Snail', icon: 'ic-clam', desc: '俗语"清明螺，赛过鹅"。此时的螺蛳未产子、泥腥尽褪，酱爆一盘能唆到停不下来。' },
        ],
      },
      {
        name: '谷雨', en: 'Grain Rain', date: '4 月 19—21 日',
        origin: '春季最后一个节气，"雨生百谷"。三候「萍始生、鸣鸠拂其羽、戴胜降于桑」。浮萍铺开水面，布谷鸟开始催耕。',
        custom: '南方采"谷雨茶"（二春茶），据说清火明目；沿海祭海神祈渔汛；中原走谷雨、赏牡丹。',
        foods: [
          { name: '香椿', en: 'Chinese Toon', icon: 'ic-greens', desc: '"雨前香椿嫩如丝"。紫芽最贵，焯水后切碎炒蛋或与豆腐同拌，香气霸道而短促。' },
          { name: '谷雨茶', en: 'Grain Rain Tea', icon: 'ic-tea', desc: '此时的茶叶芽叶肥硕、滋味鲜浓，不像春茶娇嫩，也不像夏茶干涩，是最耐泡的一档。' },
        ],
      },
    ],
  },
  {
    key: 'summer', char: '夏', name: '夏 · 消长夏', en: 'Summer', no: '02',
    tagline: '消暑解热', sub: '一碗凉汤，半日清风',
    intro: [
      '夏三月，此谓蕃秀。天地气交，万物华实——白昼被拉得很长，人的胃口却被暑气挤得很小。',
      '于是夏季的食物反其道而行：不重滋补，重"清"与"苦"。一碗绿豆、一碟苦菜、一盆过水面，靠的是把身体里的火气顺下去，而不是硬补上来。',
    ],
    terms: [
      {
        name: '立夏', en: 'Start of Summer', date: '5 月 5—7 日',
        origin: '万物进入旺季生长。三候「蝼蝈鸣、蚯蚓出、王瓜生」——蛙声起，土里翻，藤蔓爬。',
        custom: '称人、斗蛋是孩子的节俗：把蛋装在彩线网兜里挂胸前，互相撞，壳不破者为王。吃"立夏饭"与乌米饭，据说可防"疰夏"（苦夏）。',
        foods: [
          { name: '立夏饭', en: 'Five-bean Rice', icon: 'ic-rice', desc: '赤豆、黄豆、黑豆、青豆与白米同煮，五色齐全。有的地方加雷笋、豌豆，一锅就是一季的收成。' },
          { name: '立夏蛋', en: 'Summer Egg', icon: 'ic-egg', desc: '茶叶、八角、桂皮煮出的卤蛋，壳敲出细纹更入味。挂在线兜里，是孩子一整天的玩具与零食。' },
        ],
      },
      {
        name: '小满', en: 'Grain Full', date: '5 月 20—22 日',
        origin: '麦粒渐满而尚未熟透，故曰"小满"。三候「苦菜秀、靡草死、麦秋至」——苦菜正盛，喜阴的草开始枯。',
        custom: '祭车神、抢水灌田。饮食上讲究"小满食苦，一夏不苦"，吃苦菜、苦瓜，以苦清心。',
        foods: [
          { name: '苦菜', en: 'Bitter Herb', icon: 'ic-greens', desc: '焯水去苦后凉拌，或裹面蒸成"苦累"。入口微苦，回甘很长，是老一辈的清火方。' },
          { name: '枇杷', en: 'Loquat', icon: 'ic-fruit', desc: '小满前后上市，果肉柔软多汁。川贝枇杷膏用的就是它，润的是夏初那口燥。' },
        ],
      },
      {
        name: '芒种', en: 'Grain in Ear', date: '6 月 5—7 日',
        origin: '"芒"指有芒的麦子可收，"种"指有芒的稻子可种——一边收一边种，是农事最忙的节气。三候「螳螂生、䴗始鸣、反舌无声」。',
        custom: '送花神、安苗祭祀；江南煮青梅——"青梅煮酒论英雄"的典故就出在这个季节。',
        foods: [
          { name: '青梅', en: 'Green Plum', icon: 'ic-fruit', desc: '鲜梅极酸，多以糖腌、盐渍或泡酒。煮酒时丢几颗，酸香把酒气托起来。' },
          { name: '君踏菜', en: 'Summer Greens', icon: 'ic-greens', desc: '芒种前后宁波人必吃的一种青菜，据说吃了夏天不长痱子、皮肤光洁。' },
        ],
      },
      {
        name: '夏至', en: 'Summer Solstice', date: '6 月 21—22 日',
        origin: '日北至，昼最长，影最短。三候「鹿角解、蜩始鸣、半夏生」——鹿角脱落，蝉声登场，半夏在沼泽里冒头。',
        custom: '"冬至饺子夏至面"。新麦登场，吃一碗过水面最应景；岭南则啖荔枝、饮凉茶，以热制热。',
        foods: [
          { name: '过水面', en: 'Cold Noodles', icon: 'ic-noodle', desc: '面条煮熟过三遍凉水，浇麻酱、蒜汁、黄瓜丝。凉得透，才压得住暑气。' },
          { name: '荔枝', en: 'Lychee', icon: 'ic-fruit', desc: '"一骑红尘妃子笑"。夏至的荔枝刚离枝最甜，但要记得"一颗荔枝三把火"。' },
        ],
      },
      {
        name: '小暑', en: 'Minor Heat', date: '7 月 6—8 日',
        origin: '出梅入伏，暑气渐盛而未极。三候「温风至、蟋蟀居壁、鹰始鸷」——风里没了凉意，蟋蟀躲到墙根。',
        custom: '南方"食新"：新米登场先祭祖再尝新；民间"小暑黄鳝赛人参"，此时的鳝鱼最肥。',
        foods: [
          { name: '黄鳝', en: 'Ricefield Eel', icon: 'ic-eel', desc: '六月鳝鱼赛人参。红烧或炒响铃鳝片，肉厚刺少，是伏天里难得的硬菜。' },
          { name: '新米饭', en: 'New Rice', icon: 'ic-rice', desc: '早稻新碾的米，蒸出来油亮带香。配一碟咸菜，就是农人犒劳自己的一顿。' },
        ],
      },
      {
        name: '大暑', en: 'Major Heat', date: '7 月 22—24 日',
        origin: '一年中最热，湿热交蒸。三候「腐草为萤、土润溽暑、大雨时行」——萤火虫在腐草间起落，雷雨说来就来。',
        custom: '浙江沿海送"大暑船"，把瘟神送出海口；闽南吃荔枝、羊肉"过大暑"，以热补热；街头则免费施"伏茶"。',
        foods: [
          { name: '莲藕', en: 'Lotus Root', icon: 'ic-lotus', desc: '小暑吃藕。生藕清脆、熟藕绵糯，排骨炖藕汤是三伏里最温柔的一口。' },
          { name: '伏茶', en: 'Summer Herbal Tea', icon: 'ic-tea', desc: '金银花、夏枯草、甘草同煮，晾凉后大缸盛着，路人自取一碗。' },
        ],
      },
    ],
  },
  {
    key: 'autumn', char: '秋', name: '秋 · 贴秋膘', en: 'Autumn', no: '03',
    tagline: '丰收进补', sub: '一壶桂花，满山秋色',
    intro: [
      '秋三月，此谓容平。天气以急，地气以明——暑气收了，天地开始往里收。',
      '秋季的餐桌讲一个"补"字：夏天掉的膘要贴回来，干燥的肺要润起来。于是肉厚了、汤浓了、果实熟了，一年的辛劳在这时候兑现。',
    ],
    terms: [
      {
        name: '立秋', en: 'Start of Autumn', date: '8 月 7—9 日',
        origin: '梧桐一叶落，天下知秋。三候「凉风至、白露降、寒蝉鸣」。虽名为秋，暑气未退，"秋老虎"往往还要热上一阵。',
        custom: '"贴秋膘"——夏天食欲不振掉的肉，要用一顿炖肉补回来；"啃秋"则是一家人围坐分食西瓜，把暑气咬走。',
        foods: [
          { name: '贴秋膘', en: 'Autumn Fattening', icon: 'ic-pork', desc: '五花肉切方块，酱油冰糖慢炖到颤巍巍。肥肉入口即化，是秋天最有分量的一口。' },
          { name: '秋桃', en: 'Autumn Peach', icon: 'ic-fruit', desc: '立秋吃桃，桃核留到除夕丢进火塘——老辈人相信这样能辟一整年的瘟。' },
        ],
      },
      {
        name: '处暑', en: 'End of Heat', date: '8 月 22—24 日',
        origin: '"处"是止，暑气至此而止。三候「鹰乃祭鸟、天地始肃、禾乃登」——天开始有肃杀之气，庄稼登场。',
        custom: '沿海开渔节，千帆竞发吃头网海鲜；民间处暑吃鸭，老鸭汤滋阴润燥，江南一带至今如此。',
        foods: [
          { name: '处暑鸭', en: 'Old Duck Soup', icon: 'ic-duck', desc: '老鸭性凉，配冬瓜或酸萝卜慢炖两小时，汤清味厚，最解残暑。' },
          { name: '龙眼', en: 'Longan', icon: 'ic-fruit', desc: '福州人处暑吃龙眼配稀饭：剥一碗泡进温粥，甜得朴素。' },
        ],
      },
      {
        name: '白露', en: 'White Dew', date: '9 月 7—9 日',
        origin: '夜凉，水汽凝成露珠，故名白露。三候「鸿雁来、玄鸟归、群鸟养羞」——候鸟南飞，群鸟储食。',
        custom: '太湖渔家祭禹王香会；浙江一带酿"白露米酒"；老茶客专等"白露茶"——不似春茶娇嫩，不似夏茶干涩。',
        foods: [
          { name: '白露茶', en: 'White Dew Tea', icon: 'ic-tea', desc: '此时茶树经过夏季酷热，叶厚味甘，冲泡后香气沉稳，是老茶客私藏的一档。' },
          { name: '鳗鲡', en: 'Eel', icon: 'ic-eel', desc: '"白露鳗鲡霜降蟹"。此时的鳗鱼脂厚肉紧，蒲烧或清蒸皆妙。' },
        ],
      },
      {
        name: '秋分', en: 'Autumn Equinox', date: '9 月 22—24 日',
        origin: '昼夜再度均分，此后夜长昼短。三候「雷始收声、蛰虫坯户、水始涸」——雷停了，虫封洞了，水浅了。',
        custom: '古有"秋暮夕月"祭月之礼，后与中秋合流；岭南采秋菜（野苋菜）煮"秋汤"，说是"秋汤灌脏，洗涤肝肠"。',
        foods: [
          { name: '桂花糕', en: 'Osmanthus Cake', icon: 'ic-cake', desc: '新收的桂花蜜拌入糯米粉，蒸成半透明的琥珀色。凉吃弹牙，甜得很克制。' },
          { name: '秋汤', en: 'Autumn Soup', icon: 'ic-soup', desc: '野苋菜与鱼片同煮，汤色微红。喝的是汤，洗的是一夏的油腻。' },
        ],
      },
      {
        name: '寒露', en: 'Cold Dew', date: '10 月 8—9 日',
        origin: '露气寒冷，将凝为霜。三候「鸿雁来宾、雀入大水为蛤、菊有黄华」。气温比白露更低，秋意转深。',
        custom: '登高、赏菊、饮菊花酒；"寒露发脚，霜降捉着"——蟹农的行话，说的是这时候的蟹开始长足。',
        foods: [
          { name: '大闸蟹', en: 'Hairy Crab', icon: 'ic-crab', desc: '九雌十雄。掰开蟹壳，金黄的膏脂顶着壳，蘸姜醋，配黄酒。' },
          { name: '花糕', en: 'Chrysanthemum Cake', icon: 'ic-cake', desc: '重阳前后吃花糕，面皮夹枣栗，上插彩旗，取"步步登高"之意。' },
        ],
      },
      {
        name: '霜降', en: 'Frost Descent', date: '10 月 23—24 日',
        origin: '秋之末，初霜现。三候「豺乃祭兽、草木黄落、蛰虫咸俯」——草木凋零，虫兽准备过冬。',
        custom: '"霜降吃柿子，不会流鼻涕"；闽台一带霜降"补冬"，吃鸭肉、牛肉，为入冬打底。',
        foods: [
          { name: '柿子', en: 'Persimmon', icon: 'ic-persimmon', desc: '霜打过的柿子最甜。软柿吸着吃，硬柿削皮脆啃，也可串起来晒柿饼。' },
          { name: '牛肉', en: 'Beef', icon: 'ic-beef', desc: '广西玉林霜降吃牛肉，炒、炖、涮皆可，热气腾腾地补足一冬的底子。' },
        ],
      },
    ],
  },
  {
    key: 'winter', char: '冬', name: '冬 · 围炉暖', en: 'Winter', no: '04',
    tagline: '围炉进补', sub: '一锅热汤，长夜可亲',
    intro: [
      '冬三月，此谓闭藏。水冰地坼，无扰乎阳——万物藏起来，人也跟着往屋子里缩。',
      '冬季的食物只有一个字：暖。而且是那种从灶上端下来、冒着白气、能把手指烘热的暖。围炉而坐，涮的是菜，聚的是人。',
    ],
    terms: [
      {
        name: '立冬', en: 'Start of Winter', date: '11 月 7—8 日',
        origin: '水始冰，地始冻。三候「水始冰、地始冻、雉入大水为蜃」。万物进入休养收藏的状态。',
        custom: '"立冬补冬，补嘴空"。北方吃饺子——立冬是秋冬之交，"交子"之时；南方则炖羊肉、姜母鸭，热气一上来，冬天就不那么难熬了。',
        foods: [
          { name: '饺子', en: 'Dumplings', icon: 'ic-dumpling', desc: '白菜猪肉最经典，捏十八个褶。一家人围坐包完，下锅三滚，蘸醋就蒜。' },
          { name: '四物鸡', en: 'Herb Chicken', icon: 'ic-chicken', desc: '当归、川芎、白芍、熟地炖全鸡，汤色深褐。南方人家立冬这天必煲一锅。' },
        ],
      },
      {
        name: '小雪', en: 'Minor Snow', date: '11 月 22—23 日',
        origin: '始降雪，未盛。三候「虹藏不见、天气上升地气下降、闭塞而成冬」。天地不通，冬意闭藏。',
        custom: '"小雪腌菜，大雪腌肉"。家家户户开始晒鱼干、腌雪里蕻、灌腊肠；南方打糍粑，热腾腾地裹上豆粉趁热吃。',
        foods: [
          { name: '腌腊肉', en: 'Cured Meat', icon: 'ic-sausage', desc: '盐、花椒、白酒揉进肉里，腌足七日挂檐下风干。等到春节切一盘，是时间的味道。' },
          { name: '糍粑', en: 'Glutinous Cake', icon: 'ic-cake', desc: '糯米蒸熟舂打成团，裹黄豆粉与红糖。软糯滚烫，是冬日里最实在的手持甜点。' },
        ],
      },
      {
        name: '大雪', en: 'Major Snow', date: '12 月 6—8 日',
        origin: '雪渐大，地面积雪。三候「鹖鴠不鸣、虎始交、荔挺出」——寒号鸟不叫了，荔挺却在雪地里抽芽。',
        custom: '"大雪进补，开春打虎"。北方赏雪涮羊肉，南方屋檐下挂满腊味；孩童在雪地里追闹，屋内一锅翻滚。',
        foods: [
          { name: '羊肉锅', en: 'Mutton Hotpot', icon: 'ic-hotpot', desc: '铜锅炭火，清汤只放葱姜枸杞。羊肉片一涮即熟，蘸麻酱韭菜花，从胃暖到指尖。' },
          { name: '红薯粥', en: 'Sweet Potato Congee', icon: 'ic-rice', desc: '红薯切块与米同熬，粥色泛黄、微甜。大雪清晨一碗，是一天最便宜的幸福。' },
        ],
      },
      {
        name: '冬至', en: 'Winter Solstice', date: '12 月 21—23 日',
        origin: '日南至，昼最短。三候「蚯蚓结、麋角解、水泉动」。古人认为冬至是阴阳转换的节点，"冬至大如年"。',
        custom: '北方吃饺子，南方吃汤圆；祭祖宴饮，并开始画"九九消寒图"——每天染一瓣梅花，八十一天后春归。',
        foods: [
          { name: '汤圆', en: 'Glutinous Balls', icon: 'ic-tangyuan', desc: '糯米团裹芝麻或豆沙，煮到浮起。一碗六颗，取"六六大顺"，甜汤也要喝光。' },
          { name: '冬至饺', en: 'Solstice Dumplings', icon: 'ic-dumpling', desc: '"冬至不端饺子碗，冻掉耳朵没人管"。张仲景"祛寒娇耳汤"的遗俗，一吃两千年。' },
        ],
      },
      {
        name: '小寒', en: 'Minor Cold', date: '1 月 5—7 日',
        origin: '天寒而未极。三候「雁北乡、鹊始巢、雉始雊」——大雁已感知阳气，开始北望，喜鹊忙着筑巢。',
        custom: '腊八多在小寒前后，喝腊八粥；南京人吃矮脚黄青菜咸肉饭，广东人则煮腊味糯米饭。',
        foods: [
          { name: '腊八粥', en: 'Laba Congee', icon: 'ic-soup', desc: '米、豆、枣、栗、莲子、桂圆同熬一锅，慢火稠糯。寺庙施粥，家家分送。' },
          { name: '菜饭', en: 'Greens Rice', icon: 'ic-rice', desc: '矮脚黄青菜切碎，与咸肉丁、板油一同焖饭。锅底那层焦黄的锅巴最抢手。' },
        ],
      },
      {
        name: '大寒', en: 'Major Cold', date: '1 月 20—21 日',
        origin: '岁末最冷。三候「鸡始乳、征鸟厉疾、水泽腹坚」——冰一直冻到水中央。大寒一过，又是立春。',
        custom: '"大寒迎年"。此时节扫尘、赶年集、备年货；饭桌上摆八宝饭、年糕，甜甜糯糯地送走旧岁。',
        foods: [
          { name: '八宝饭', en: 'Eight-treasure Rice', icon: 'ic-rice', desc: '糯米蒸透拌猪油白糖，碗底铺红枣莲子桂圆，倒扣出来是一个圆满的半球。' },
          { name: '年糕', en: 'New Year Cake', icon: 'ic-cake', desc: '水磨糯米粉蒸熟捶打，切片炒或煮汤。"年年高"，是岁末最直白的祝词。' },
        ],
      },
    ],
  },
];

/* ================= 模板 ================= */
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8D%9C%3C/text%3E%3C/svg%3E";
const FONTS = 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap';
const STYLE_KEY = 'foodpage-style';

function page(s, prev, next) {
  const introP = s.intro.map((p) => `          <p>${p}</p>`).join('\n');

  const termHtml = s.terms.map((t, i) => {
    const foodsLi = t.foods.map((f) => `            <li class="food">
              <svg class="food-ic" aria-hidden="true"><use href="#${f.icon}"/></svg>
              <div>
                <h4>${f.name}<i>${f.en}</i></h4>
                <p>${f.desc}</p>
              </div>
            </li>`).join('\n');
    return `        <section class="term rv" style="--d:${(i % 3) * 0.06}s">
          <div class="term-head">
            <span class="term-no">${CN_NO[i]}</span>
            <div>
              <h3>${t.name}<i>${t.en}</i></h3>
              <p class="term-date">${t.date}</p>
            </div>
          </div>
          <div class="term-body">
            <p class="t-label">由来与物候</p>
            <p>${t.origin}</p>
            <p class="t-label">食俗讲究</p>
            <p>${t.custom}</p>
            <p class="t-label">当令食材</p>
            <ul class="food-list">
${foodsLi}
            </ul>
          </div>
        </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="食味人间 · ${s.name}食单 —— ${s.tagline}。附${s.terms.map((t) => t.name).join('、')}六个节气的物候由来、食俗讲究与当令食材。">
<title>${s.name.slice(0, 1)}季食单 · 节气食单 · 食味人间</title>
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<style>
:root{
  --paper:#f6efe1; --paper-2:#efe5d0; --card:#fbf6ea;
  --ink:#2a2018; --ink-2:#6b5a46; --line:rgba(42,32,24,.16);
  --red:#b23a2a; --red-2:#8e2b1e; --gold:#c8963e; --gold-2:#d8a04a;
  --f-cal:'Ma Shan Zheng','STKaiti','KaiTi','SimSun',serif;
  --f-serif:'Noto Serif SC','Source Han Serif SC','SimSun',serif;
  --f-lat:'Cormorant Garamond',Georgia,'Times New Roman',serif;
}
*{margin:0;padding:0;box-sizing:border-box}
/* 与首页同：html 与 body 都要写 overflow-x，只写 body 移动端仍会出现横向空白条 */
html{scroll-behavior:smooth;overflow-x:hidden}
body{
  font-family:var(--f-serif);background:var(--paper);color:var(--ink);
  line-height:1.85;overflow-x:hidden;-webkit-font-smoothing:antialiased;
}
::selection{background:var(--red);color:var(--paper)}
img,svg{display:block}
a{color:inherit;text-decoration:none}
ul,ol{list-style:none}
.container{width:min(960px,92vw);margin:0 auto}
.defs{position:absolute;width:0;height:0;overflow:hidden}

/* 纸张噪点 */
.grain{
  position:fixed;inset:0;z-index:150;pointer-events:none;opacity:.35;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
}

/* ---------- 顶栏 ---------- */
.topbar{
  position:fixed;top:0;left:0;right:0;z-index:100;height:64px;
  background:rgba(246,239,225,.93);backdrop-filter:blur(9px);
  border-bottom:1px solid var(--line);
}
.nav-in{width:min(1180px,92vw);margin:0 auto;height:64px;display:flex;align-items:center;justify-content:space-between;gap:1.4rem}
.logo{display:flex;align-items:center;gap:.5rem;font-family:var(--f-cal);font-size:1.3rem;letter-spacing:.06em}
.mini-seal{width:26px;height:26px;flex:none;display:grid;place-items:center;background:var(--red);color:#fff;font-family:var(--f-serif);font-size:.86rem;border-radius:3px}
.logo small{font-family:var(--f-lat);font-size:.68rem;letter-spacing:.18em;color:var(--ink-2)}
.nav-links{display:flex;align-items:center;gap:1.4rem;font-size:.88rem}
.nav-links a{transition:color .3s}
.nav-links a:hover{color:var(--red)}
@media (max-width:640px){
  .nav-links a:not(.ss-back){display:none}
  .logo small{display:none}
  .nav-links{gap:.9rem}
}

/* ---------- 风格切换按钮 ---------- */
.style-switch{
  display:inline-flex;align-items:center;gap:.4rem;cursor:pointer;flex:none;
  font:inherit;font-size:.76rem;font-weight:700;letter-spacing:.06em;white-space:nowrap;
  padding:.34rem .8rem;border:2px solid var(--ink);border-radius:999px;
  background:var(--paper);color:var(--ink);box-shadow:2px 3px 0 rgba(42,32,24,.45);
  transition:transform .28s, background .35s, color .35s, box-shadow .35s;
}
.style-switch:hover{transform:translateY(-2px)}
.style-switch:active{transform:translateY(1px);box-shadow:1px 2px 0 rgba(42,32,24,.45)}
.style-switch .ss-ico{width:15px;height:15px;display:block;flex:none}
.style-switch .ss-ico svg{width:100%;height:100%}
@media (max-width:640px){
  .style-switch{padding:.32rem .48rem;gap:0}
  .style-switch .ss-txt{display:none}
}

/* ---------- 专栏头图 ---------- */
.c-hero{
  position:relative;overflow:hidden;
  padding:9.5rem 0 3.6rem;
  background:
    radial-gradient(680px 360px at 88% 18%, rgba(200,150,62,.16), transparent 72%),
    linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%);
  border-bottom:1px solid var(--line);
}
.c-hero-in{position:relative}
.c-big{
  position:absolute;right:0;top:-3.4rem;
  font-family:var(--f-cal);font-size:15rem;line-height:1;
  color:rgba(42,32,24,.08);pointer-events:none;user-select:none;
}
.c-crumb{font-size:.8rem;letter-spacing:.14em;color:var(--ink-2)}
.c-crumb i{font-style:normal;margin:0 .5rem;opacity:.6}
.c-crumb a:hover{color:var(--red)}
.c-no{font-family:var(--f-lat);font-style:italic;font-weight:600;color:var(--red);letter-spacing:.1em;margin-top:1.1rem}
.c-hero h1{font-size:clamp(2.4rem,6vw,3.8rem);font-weight:900;letter-spacing:.06em;line-height:1.2}
.c-hero h1 i{
  display:block;font-family:var(--f-lat);font-style:italic;font-weight:500;
  font-size:1.05rem;letter-spacing:.18em;color:var(--red);margin-top:.4rem;
}
.c-tag{
  display:inline-block;margin-top:1.2rem;padding:.28rem 1.1rem;
  border:1px solid rgba(178,58,42,.5);border-radius:999px;
  font-size:.82rem;letter-spacing:.24em;color:var(--red);
}
.c-sub{margin-top:.9rem;font-family:var(--f-cal);font-size:1.5rem;color:var(--ink-2);letter-spacing:.08em}

/* ---------- 正文版块 ---------- */
.c-main{padding:4.2rem 0 2rem}
.c-sec{margin-bottom:3.2rem}
.c-h2{
  display:flex;align-items:baseline;gap:.9rem;
  font-size:1.5rem;font-weight:900;letter-spacing:.1em;
  padding-bottom:.9rem;margin-bottom:1.5rem;border-bottom:1px solid var(--line);
}
.c-h2-no{font-family:var(--f-cal);font-size:1.9rem;color:var(--red);line-height:1;flex:none}
.c-body p{margin-bottom:1.1rem;color:var(--ink);text-align:justify}

/* ---------- 节气块 ---------- */
.terms{display:grid;gap:1.6rem}
.term{padding:1.7rem 1.8rem;background:var(--card);border:1px solid var(--line)}
.term-head{
  display:flex;gap:1rem;align-items:baseline;
  padding-bottom:.85rem;margin-bottom:1rem;border-bottom:1px dashed var(--line);
}
.term-no{font-family:var(--f-cal);font-size:2.1rem;color:var(--red);line-height:1;flex:none}
.term h3{font-size:1.4rem;font-weight:900;letter-spacing:.08em;display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap}
.term h3 i{font-family:var(--f-lat);font-style:italic;font-weight:500;font-size:.82rem;color:var(--ink-2);letter-spacing:.08em}
.term-date{font-size:.78rem;letter-spacing:.16em;color:var(--gold);margin-top:.25rem}
.term-body p{font-size:.94rem;color:var(--ink);text-align:justify}
.t-label{
  font-size:.78rem;letter-spacing:.22em;color:var(--ink-2);
  margin:1.1rem 0 .3rem;
}
.t-label:first-child{margin-top:0}
.food-list{display:grid;gap:.75rem;margin-top:.9rem}
.food{
  display:flex;gap:.95rem;align-items:flex-start;
  padding:.8rem .95rem;border:1px dashed var(--line);background:var(--paper);
}
.food-ic{
  width:32px;height:32px;flex:none;color:var(--red);
  fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
.food h4{font-size:1rem;font-weight:900;letter-spacing:.05em;display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}
.food h4 i{font-family:var(--f-lat);font-style:italic;font-weight:500;font-size:.78rem;color:var(--ink-2);letter-spacing:.08em}
.food p{margin-top:.2rem;font-size:.88rem;color:var(--ink-2);line-height:1.8}

/* ---------- 底部导航 ---------- */
.c-nav{border-top:1px solid var(--line);background:var(--paper-2);padding:2.2rem 0}
.c-nav-in{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
.c-nav-btn{
  padding:.5rem 1.1rem;border:1px solid var(--line);background:var(--paper);
  font-size:.88rem;letter-spacing:.06em;transition:all .3s;
}
.c-nav-btn:hover{background:var(--red);color:var(--paper);border-color:var(--red)}
.c-nav-home{border-style:dashed}
.c-footer{padding:2.6rem 0 3.2rem;text-align:center;border-top:1px solid var(--line)}
.c-footer p{font-family:var(--f-cal);font-size:1.25rem;letter-spacing:.1em}
.c-footer-sub{font-family:var(--f-serif);font-size:.8rem;color:var(--ink-2);letter-spacing:.18em;margin-top:.35rem}

/* ---------- 滚动入场 ---------- */
.rv{opacity:0;transform:translateY(26px);transition:opacity .9s ease var(--d,0s), transform .9s cubic-bezier(.16,.84,.3,1) var(--d,0s)}
.rv.on{opacity:1;transform:none}

@media (max-width:640px){
  .c-hero{padding:8rem 0 2.6rem}
  .c-big{font-size:10rem;top:-2.2rem;right:-.4rem}
  .c-main{padding:3rem 0 1rem}
  .c-h2{font-size:1.25rem}
  .term{padding:1.2rem 1.1rem}
  .term-no{font-size:1.7rem}
  .term h3{font-size:1.2rem}
  .food{padding:.75rem .8rem;gap:.8rem}
  .food-ic{width:28px;height:28px}
  .c-nav-in{flex-direction:column}
  .c-nav-btn{width:100%;text-align:center}
}
@media (prefers-reduced-motion:reduce){
  *,.rv{animation:none!important;transition:none!important}
  .rv{opacity:1;transform:none}
}

/* ==========================================================
   风格 B · 中华小当家（精简版，与首页共用同一 localStorage 键）
   ========================================================== */
body.xdj{
  --paper:#fff3d0; --paper-2:#ffeab4; --card:#fffaf0;
  --ink:#3d1a08; --ink-2:#7a4a22; --line:rgba(61,26,8,.22);
  --red:#d5241a; --red-2:#a3140c; --gold:#ffd24a; --gold-2:#ffb300;
}
body.xdj .c-hero::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:repeating-conic-gradient(from 0deg at 82% 26%, rgba(255,210,74,.42) 0 3deg, transparent 3deg 10deg);
  -webkit-mask-image:radial-gradient(110% 90% at 82% 26%, transparent 7%, #000 68%);
  mask-image:radial-gradient(110% 90% at 82% 26%, transparent 7%, #000 68%);
}
body.xdj .c-hero{
  background:linear-gradient(180deg,#fff3d0 0%,#ffe089 100%);
  border-bottom:4px solid var(--ink);
}
body.xdj .c-big{color:rgba(61,26,8,.13)}
body.xdj .c-hero h1{
  text-shadow:2px 2px 0 var(--paper), 4px 4px 0 rgba(61,26,8,.35);
  -webkit-text-stroke:1.5px var(--ink);
}
body.xdj .c-h2{border-bottom:3px solid var(--ink)}
body.xdj .c-h2-no{color:var(--red);-webkit-text-stroke:.6px var(--ink)}
body.xdj .term{
  border:3px solid var(--ink);border-radius:4px;
  box-shadow:5px 6px 0 rgba(61,26,8,.75);
}
body.xdj .term-no{color:var(--red);-webkit-text-stroke:.6px var(--ink)}
body.xdj .food{border:2px dashed rgba(61,26,8,.4)}
body.xdj .food-ic{color:var(--red)}
body.xdj .c-nav-btn{border:3px solid var(--ink);font-weight:700;box-shadow:3px 4px 0 rgba(61,26,8,.7)}
body.xdj .c-nav-btn:hover{background:var(--red);color:var(--gold)}
body.xdj .c-nav{border-top:4px solid var(--ink)}
body.xdj .style-switch{background:var(--red);color:#ffe45c;border-color:var(--ink);box-shadow:2px 3px 0 rgba(61,26,8,.8)}
body.xdj .topbar{background:rgba(255,243,208,.94);border-bottom:3px solid var(--ink)}
</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>

<!-- 本页按需内联的食材图标（从 index.html 图标库抽取） -->
<svg class="defs" aria-hidden="true">
  <defs>
${symbolsFor(s.terms)}
      </defs>
    </svg>

<nav class="topbar">
  <div class="nav-in">
    <a class="logo" href="index.html"><span class="mini-seal">食</span>食味人间<small>A Journal of Chinese Flavours</small></a>
    <div class="nav-links">
      <a href="index.html#columns">寻味栏目</a>
      <a class="ss-back" href="index.html">← 返回首页</a>
      <button type="button" class="style-switch" id="styleSwitch" aria-pressed="false" title="切换页面风格">
        <span class="ss-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.6l1.9 4.6 4.6 1.9-4.6 1.9L12 15.6l-1.9-4.6L5.5 9.1l4.6-1.9z"/>
            <path d="M18.6 15.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>
          </svg>
        </span>
        <span class="ss-txt">小当家模式</span>
      </button>
    </div>
  </div>
</nav>

<header class="c-hero">
  <div class="container c-hero-in">
    <span class="c-big" aria-hidden="true">${s.char}</span>
    <p class="c-crumb"><a href="index.html#columns">节气食单</a><i>/</i>${s.name}</p>
    <p class="c-no">No.${s.no}</p>
    <h1>${s.name}<i>${s.en} · Six Solar Terms</i></h1>
    <p class="c-tag">${s.tagline}</p>
    <p class="c-sub">${s.sub}</p>
  </div>
</header>

<main class="container c-main">
  <section class="c-sec rv">
    <h2 class="c-h2"><span class="c-h2-no">序</span>${s.name.slice(0, 1)}季食事</h2>
    <div class="c-body">
${introP}
    </div>
  </section>

  <section class="c-sec rv" style="--d:.06s">
    <h2 class="c-h2"><span class="c-h2-no">陆</span>六个节气</h2>
    <div class="terms">
${termHtml}
    </div>
  </section>
</main>

<nav class="c-nav">
  <div class="container c-nav-in">
    <a class="c-nav-btn" href="season-${prev.key}.html">← ${prev.name}</a>
    <a class="c-nav-btn c-nav-home" href="index.html#columns">返回节气食单</a>
    <a class="c-nav-btn" href="season-${next.key}.html">${next.name} →</a>
  </div>
</nav>

<footer class="c-footer">
  <div class="container">
    <p>食味人间 · 中华美食志</p>
    <p class="c-footer-sub">不时不食，顺时而食</p>
  </div>
</footer>

<script>
/* 风格切换：与首页共用 localStorage 键 ${STYLE_KEY} */
(function(){
  var KEY='${STYLE_KEY}', btn=document.getElementById('styleSwitch');
  if(!btn)return;
  var txt=btn.querySelector('.ss-txt');
  function apply(mode,save){
    var on=(mode==='xdj');
    document.body.classList.toggle('xdj',on);
    btn.setAttribute('aria-pressed',on?'true':'false');
    if(txt)txt.textContent=on?'水墨模式':'小当家模式';
    if(save){try{localStorage.setItem(KEY,mode);}catch(e){}}
  }
  var saved=null;try{saved=localStorage.getItem(KEY);}catch(e){}
  apply(saved==='xdj'?'xdj':'ink',false);
  btn.addEventListener('click',function(){
    apply(document.body.classList.contains('xdj')?'ink':'xdj',true);
  });
})();

/* 滚动入场 */
(function(){
  var els=document.querySelectorAll('.rv');
  if(!els.length)return;
  if(!('IntersectionObserver' in window)){
    for(var i=0;i<els.length;i++)els[i].classList.add('on');
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){en.target.classList.add('on');io.unobserve(en.target);}
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){io.observe(el);});
})();
</script>
</body>
</html>
`;
}

/* ================= 生成 ================= */
let count = 0;
SEASONS.forEach((s, i) => {
  const prev = SEASONS[(i - 1 + SEASONS.length) % SEASONS.length];
  const next = SEASONS[(i + 1) % SEASONS.length];
  const file = path.join(__dirname, `season-${s.key}.html`);
  fs.writeFileSync(file, page(s, prev, next), 'utf8');
  count++;
});

const lines = [
  `图标库抽取：${iconCount} 个 symbol`,
  `生成季节专栏页：${count} 个`,
  ...SEASONS.map((s) => `  season-${s.key}.html  ${s.name}  ${s.terms.length} 节气 / ${s.terms.reduce((n, t) => n + t.foods.length, 0)} 食材  ${(fs.statSync(path.join(__dirname, `season-${s.key}.html`)).size / 1024).toFixed(1)} KB`)
];
console.log(lines.join('\n'));

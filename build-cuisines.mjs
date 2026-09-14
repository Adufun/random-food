/**
 * 八大菜系专栏页生成器
 * ----------------------------------------------------------
 * 从 index.html 抽取 SVG 图标 symbol（唯一真源），按同一模板生成
 * cuisine-chuan / yue / lu / su / zhe / min / xiang / hui.html
 * 改完数据重新执行：node build-cuisines.mjs
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
function symbolsFor(dishes) {
  const ids = [...new Set(dishes.map((d) => d.icon))];
  return ids.map((id) => {
    if (!SYMBOLS[id]) throw new Error('缺少图标：' + id);
    return '        ' + SYMBOLS[id];
  }).join('\n');
}

/* ================= 菜系数据 ================= */
const CUISINES = [
  {
    key: 'chuan', char: '川', name: '川菜', en: 'Sichuan', no: '01',
    tagline: '麻辣鲜香', sub: '一勺豆瓣，半城烟火',
    origin: [
      '四川盆地四面群山环抱，湿气聚而不散。川人借辛辣发汗祛湿，本是生存所需；辣椒明末经海路传入，与本土花椒在蜀地相遇，才真正熬出「麻辣」这一味。',
      '秦汉时蜀地已「尚滋味、好辛香」，唐宋渐成体系，清末民初定型为今天的面貌。郫县豆瓣、泡菜、醪糟，是川味的三副骨架——有了它们，寻常食材也能立起来。'
    ],
    flavorDesc: '一菜一格，百菜百味。川菜之辣从不单调，二十四种味型各立门户，同一味辣椒能调出鱼香、怪味、荔枝、陈皮等全然不同的走向。',
    tastes: ['麻辣', '红油', '鱼香', '怪味', '家常', '酸辣', '椒麻', '陈皮'],
    techs: ['小炒', '干煸', '干烧', '粉蒸', '水煮', '火爆', '煨炖', '凉拌'],
    dishes: [
      { name: '麻婆豆腐', en: 'Mapo Tofu', icon: 'ic-tofu', desc: '清同治年间成都陈麻婆创制。麻、辣、烫、香、酥、嫩、鲜、活，八字诀写尽一碗豆腐的功夫。' },
      { name: '宫保鸡丁', en: 'Kung Pao Chicken', icon: 'ic-chicken', desc: '源出贵州，因丁宝桢（官拜宫保）得名。糊辣荔枝味——先酸后甜，辣在尾梢。' },
      { name: '水煮鱼', en: 'Boiled Fish in Chili Oil', icon: 'ic-fish', desc: '重庆江湖菜。鱼片滑嫩靠上浆与火候，最后一勺滚油激在辣椒花椒上，香气是「泼」出来的。' },
      { name: '回锅肉', en: 'Twice-cooked Pork', icon: 'ic-pork', desc: '先煮后炒，肉片卷成灯盏窝方为上品。川人称之为「川菜之王」，一家一味。' },
      { name: '夫妻肺片', en: 'Husband and Wife Lung Slices', icon: 'ic-tripe', desc: '上世纪三十年代成都郭朝华夫妇创制。牛杂切得薄可透光，红油一拌，麻辣浓香。' },
      { name: '鱼香肉丝', en: 'Fish-fragrant Pork', icon: 'ic-bamboo', desc: '菜里无鱼，却有鱼香——泡红椒、姜蒜与糖醋调出的味型，是川菜调味术的代表作。' },
      { name: '四川火锅', en: 'Sichuan Hotpot', icon: 'ic-hotpot', desc: '牛油打底，花椒辣椒同炒。九宫格不是噱头，是分火候：中心翻滚涮毛肚，边缘慢煨炖脑花。' },
      { name: '担担面', en: 'Dan Dan Noodles', icon: 'ic-noodle', desc: '旧时挑担叫卖，一头面一头汤。麻酱、肉臊、芽菜与红油，一碗里层次分明。' }
    ],
    trivia: [
      '花椒的「麻」严格说不是味觉：羟基-α-山椒素让口腔产生约每秒五十次的振动错觉，是触觉在骗舌头。',
      '郫县豆瓣要「翻、晒、露」足三年。白天晒、夜里露，靠时间与阳光把蚕豆和辣椒揉成一体。',
      '传统川菜席讲究「三蒸九扣」，八大碗上桌有先后次序，先上什么后上什么都有说法。'
    ]
  },
  {
    key: 'yue', char: '粤', name: '粤菜', en: 'Cantonese', no: '02',
    tagline: '清而不淡', sub: '食不厌精，脍不厌细',
    origin: [
      '岭南背山面海，四季常青，物产极丰。气候炎热，故尚清淡以求本味；面朝南海，则练就一身治海鲜的本事。「鲜」是粤菜唯一不肯让步的标准。',
      '秦汉中原移民南下带来中原技法，唐宋时广州已是通商大港，清末民初餐饮鼎盛，「食在广州」的说法随华侨远播南洋与欧美。'
    ],
    flavorDesc: '五滋六味，重在镬气与本味。调味只是陪衬，让食材自己说话；火候与时间是真正的主角。',
    tastes: ['清鲜', '嫩滑', '爽脆', '镬气', '蚝油', '豉汁', '白灼', '生焗'],
    techs: ['白灼', '清蒸', '焗', '煲', '卤', '烧腊', '小炒', '老火炖'],
    dishes: [
      { name: '白切鸡', en: 'Plain Boiled Chicken', icon: 'ic-chicken', desc: '「浸」而非煮：虾眼水微沸浸熟，再过冰水。皮爽、肉嫩、骨边微红，是最见火候的一道。' },
      { name: '虾饺', en: 'Shrimp Dumpling', icon: 'ic-dumpling', desc: '广式点心四大天王之首。皮要薄而透，褶子十三道以上，咬开汁水不破皮。' },
      { name: '烧鹅', en: 'Roast Goose', icon: 'ic-duck', desc: '荔枝木明炉烤制，果木香渗进皮里。出炉后皮脆如纸，须在二十分钟内上桌。' },
      { name: '蜜汁叉烧', en: 'Honey BBQ Pork', icon: 'ic-pork', desc: '取猪梅肉挂炉，边烤边刷蜜汁。好叉烧要「肥而不腻、瘦而不柴」，切面泛着蜜光。' },
      { name: '清蒸石斑', en: 'Steamed Grouper', icon: 'ic-fish', desc: '火候以秒计，多一分则老。豉油最后淋、热油最后泼，顺序错了鲜味就散了。' },
      { name: '老火靓汤', en: 'Slow-boiled Soup', icon: 'ic-soup', desc: '「三煲四炖」——煲三小时，炖四小时。广东人认为汤水能调一切，四季配方各不相同。' },
      { name: '干炒牛河', en: 'Beef Chow Fun', icon: 'ic-beef', desc: '镬气的试金石。河粉不碎不粘、碟底不见余油，才算合格；这道菜能检验一个炒锅师傅的全部功力。' },
      { name: '肠粉', en: 'Rice Noodle Roll', icon: 'ic-rice', desc: '布拉派与抽屉派各有拥趸。米浆要用陈米磨，才够爽滑不黏牙。' }
    ],
    trivia: [
      '粤菜讲「镬气」：食材在猛火下瞬间焦糖化与美拉德反应产生的香气，离开灶台数十秒即散，所以炒粉面必须跑着上桌。',
      '早茶「一盅两件」——一盅茶配两件点心，本是码头工人果腹的廉价吃法，日后演变成广府最讲究的一餐。',
      '判断白切鸡熟度的老法：看鸡腿骨缝里不见血水，而骨髓仍带微红，此时方为刚好。'
    ]
  },
  {
    key: 'lu', char: '鲁', name: '鲁菜', en: 'Shandong', no: '03',
    tagline: '咸鲜醇厚', sub: '宫廷菜脉，北方之魂',
    origin: [
      '山东半岛三面临海，内陆有黄河冲积平原，海味、河鲜、粮畜俱全；自古盐业发达，重咸鲜的口味由此而生。',
      '春秋时孔子「食不厌精，脍不厌细」已为中原饮食立下法度；明清鲁菜入主宫廷，成为京菜、津菜与东北菜的共同源头，被称为「八大菜系之首」。'
    ],
    flavorDesc: '以咸鲜为骨、以吊汤为魂。「堂做」之外，鲁菜最重火候，「爆」字当先，成菜以秒计。',
    tastes: ['咸鲜', '酱香', '糖醋', '葱香', '奶汤', '清汤', '蒜香', '五香'],
    techs: ['爆', '塌', '扒', '烧', '拔丝', '蜜汁', '蒸', '烤'],
    dishes: [
      { name: '葱烧海参', en: 'Sea Cucumber with Scallion', icon: 'ic-seacucumber', desc: '章丘大葱与刺参同烧，葱段炸至金黄取其香，海参吸饱汤汁，软糯而形不散。' },
      { name: '糖醋鲤鱼', en: 'Sweet and Sour Carp', icon: 'ic-fish', desc: '黄河鲤鱼改刀成跃龙门之姿，外焦里嫩。上桌浇汁时「吱啦」作响，是鲁菜里的热闹戏码。' },
      { name: '九转大肠', en: 'Braised Intestines', icon: 'ic-tripe', desc: '济南老店创制。酸、甜、苦、辣、咸五味俱全，层层递进，故名「九转」。' },
      { name: '油焖大虾', en: 'Braised Prawns', icon: 'ic-shrimp', desc: '渤海对虾为主料，油焖收汁。壳红油亮，虾肉紧实，甜咸之间见火候。' },
      { name: '四喜丸子', en: 'Four-Joy Meatballs', icon: 'ic-meatball', desc: '婚寿宴席上的必备。四个大肉圆寓意福禄寿喜，先炸后炖，入口即化。' },
      { name: '德州扒鸡', en: 'Dezhou Braised Chicken', icon: 'ic-chicken', desc: '老汤焖煮，提起鸡腿一抖，骨肉立时分离。创始于清代，随津浦铁路的汽笛传遍南北。' },
      { name: '木须肉', en: 'Moo Shu Pork', icon: 'ic-egg', desc: '木耳、黄花菜、鸡蛋与肉片同炒。看似家常，实为鲁菜讲究配料平衡的典型。' },
      { name: '奶汤蒲菜', en: 'Cattail in Milk Soup', icon: 'ic-greens', desc: '济南大明湖蒲菜配奶汤。清鲜见真功夫，是鲁菜「吊汤」技艺最直白的展示。' }
    ],
    trivia: [
      '鲁菜吊汤极繁：老母鸡、猪肘、鸭与火腿同煮，清汤还要反复「扫汤」——用鸡茸吸附杂质，直至澄澈见底。',
      '「爆」法要求油温七成以上，行话叫「爆菜不过三秒」，慢一秒就失了脆嫩。',
      '拔丝菜上桌必跟一碗凉水：趁热夹起拉出金丝，入水一蘸即脆，否则糖丝会拉得到处都是。'
    ]
  },
  {
    key: 'su', char: '苏', name: '苏菜', en: 'Jiangsu', no: '04',
    tagline: '清雅微甜', sub: '刀工如画，浓淡相宜',
    origin: [
      '长江下游鱼米之乡，河湖密布，时鲜四季不断。水乡的物产决定了苏菜以河鲜、湖鲜与时蔬为主，讲究「不时不食」。',
      '隋唐扬州已成繁华都会，明清盐商云集，家厨竞相斗艺，淮扬菜遂成文人菜与官府菜的代表，也长期是国宴的底色。'
    ],
    flavorDesc: '刀工精细，火工讲究，口味平和。不靠重味压人，而求本味与层次的平衡，是八大菜系里最「文气」的一支。',
    tastes: ['清鲜', '平和', '微甜', '醇和', '蟹香', '糟香', '本味', '酥烂'],
    techs: ['炖', '焖', '煨', '蒸', '焐', '炒', '烧', '剞花批片'],
    dishes: [
      { name: '松鼠桂鱼', en: 'Squirrel Mandarin Fish', icon: 'ic-fish', desc: '剞花如松鼠毛，炸后外脆内嫩，浇汁时吱吱作响。既是菜，也是一场表演。' },
      { name: '盐水鸭', en: 'Nanjing Salted Duck', icon: 'ic-duck', desc: '南京人唤作「桂花鸭」，以中秋前后桂花飘香时的鸭子最肥。皮白肉嫩，咸香入骨。' },
      { name: '蟹粉狮子头', en: 'Crab Roe Lion’s Head', icon: 'ic-meatball', desc: '细切粗斩，肉丁而非肉糜，加蟹粉提鲜。清炖而不油炸，入口松而不柴。' },
      { name: '大煮干丝', en: 'Braised Dried Tofu Shreds', icon: 'ic-tofu', desc: '一方豆腐干要批成十八片，再切成细如线的丝。刀工到不到位，一眼便知。' },
      { name: '叫花鸡', en: 'Beggar’s Chicken', icon: 'ic-chicken', desc: '荷叶裹泥煨熟，敲开泥壳时香气扑出。相传源自乞丐的野炊，如今已是宴席名菜。' },
      { name: '水晶肴肉', en: 'Crystal Pork Jelly', icon: 'ic-pork', desc: '硝腌后压冻，肉红皮白，透如水晶。镇江人清晨配姜丝与香醋，佐一壶茶。' },
      { name: '响油鳝糊', en: 'Sizzling Eel', icon: 'ic-eel', desc: '上桌现浇一勺滚油，「滋啦」一声才算完成。鳝丝软糯，蒜香浓郁。' },
      { name: '扬州炒饭', en: 'Yangzhou Fried Rice', icon: 'ic-rice', desc: '粒粒分明谓之「金裹银」。配料有定数，也有各家的小心思，是淮扬菜最普及的一张名片。' }
    ],
    trivia: [
      '文思豆腐考验刀工：一块嫩豆腐可切成数千根细丝，入水如絮而不散，据说能穿针。',
      '淮扬菜是国宴常客。它不辣不麻、口味平和、老少咸宜，被称为「开国第一宴」的底色。',
      '狮子头讲究「细切粗斩」：肉要切成石榴粒大小而非剁成泥，成型后内部才有空隙，炖出来才松。'
    ]
  },
  {
    key: 'zhe', char: '浙', name: '浙菜', en: 'Zhejiang', no: '05',
    tagline: '鲜嫩爽滑', sub: '山色入馔，湖味成诗',
    origin: [
      '浙北水网、浙东沿海、浙南山陵，一省之内三般风味：杭嘉湖的湖鲜、宁绍的海产、金华的火腿，各成一格。',
      '南宋定都临安，中原饮食与江南风物交融；明清文人辈出，菜名也带上诗情——东坡肉、宋嫂鱼羹，皆以人入馔。'
    ],
    flavorDesc: '选料讲求「细、特、鲜、嫩」，烹调以保持本味为要。口味清鲜，讲究时令，一分不多一分不少。',
    tastes: ['清鲜', '嫩滑', '香脆', '醇厚', '糟香', '酱香', '微甜', '本味'],
    techs: ['炒', '炸', '蒸', '烩', '糟', '醉', '烤', '焖'],
    dishes: [
      { name: '西湖醋鱼', en: 'West Lake Vinegar Fish', icon: 'ic-fish', desc: '活鱼先「饿养」一两日去土味，汆熟后浇糖醋汁，不见一滴油而鲜嫩异常。' },
      { name: '龙井虾仁', en: 'Shrimp with Longjing Tea', icon: 'ic-shrimp', desc: '清明前的新茶入馔，茶香清雅回甘。虾仁要现剥现炒，方能脆嫩。' },
      { name: '东坡肉', en: 'Dongpo Pork', icon: 'ic-pork', desc: '苏轼《食猪肉诗》写得明白：「慢着火，少着水，火候足时他自美。」一块肉焖足时辰，酥而不碎。' },
      { name: '宋嫂鱼羹', en: 'Songsao Fish Soup', icon: 'ic-soup', desc: '八百年前的南宋名羹流传至今。鱼肉拆碎，配火腿、香菇与笋，稠而不腻，鲜中带酸。' },
      { name: '油焖春笋', en: 'Braised Spring Bamboo', icon: 'ic-bamboo', desc: '临安天目山笋最佳。重油重糖焖透，色泽红亮，咸甜交织。' },
      { name: '干炸响铃', en: 'Fried Tofu Skin Rolls', icon: 'ic-skewer', desc: '豆腐皮裹肉馅炸脆，嚼之有声，故名响铃。蘸甜面酱或椒盐皆可。' },
      { name: '荷叶粉蒸肉', en: 'Lotus Leaf Steamed Pork', icon: 'ic-greens', desc: '米粉裹肉，荷叶包蒸。荷香渗进米粒，油而不腻，是江南夏天的味道。' },
      { name: '醉蟹', en: 'Wine-marinated Crab', icon: 'ic-crab', desc: '黄酒生腌，蟹肉凝如膏脂，酒香与蟹鲜彼此成全。宁波、绍兴各有配方。' }
    ],
    trivia: [
      '西湖醋鱼用的草鱼要饿养一两日，排净泥腥，肉质也更紧致——这是从前楼外楼不成文的规矩。',
      '金华火腿与宣威火腿、如皋火腿并称中国三大火腿。一只好腿需经冬历夏，发酵时间以年计。',
      '宁波菜讲「咸鲜合一」：雪里蕻咸齑配黄鱼，鲜上加鲜，是浙东沿海最典型的味型。'
    ]
  },
  {
    key: 'min', char: '闽', name: '闽菜', en: 'Fujian', no: '06',
    tagline: '汤醇鲜和', sub: '坛启荤香，飘连四邻',
    origin: [
      '福建「八山一水一分田」，背山面海，山珍与海味兼得。气候温暖湿润，食材易腐，因而格外重汤、重糟、重保鲜之法。',
      '唐宋海上丝绸之路带来番薯与香料；近代福州、厦门开埠，餐饮鼎盛，闽菜也随华侨远播南洋，成为许多东南亚菜式的源头之一。'
    ],
    flavorDesc: '汤菜居首，一汤十变。红糟入馔是闽菜的独门标记，酸甜淡雅与醇厚荤香并存。',
    tastes: ['清鲜', '和醇', '荤香', '糟香', '酸甜', '淡雅', '鲜爽', '沙茶'],
    techs: ['煨', '炖', '蒸', '炒', '糟', '醉', '拌', '吊汤'],
    dishes: [
      { name: '佛跳墙', en: 'Buddha Jumps Over the Wall', icon: 'ic-soup', desc: '十余种山珍海味入绍兴酒坛，荷叶封口，炭火慢煨数日。开坛那一刻，香气能穿堂。' },
      { name: '荔枝肉', en: 'Lychee Pork', icon: 'ic-pork', desc: '剞花如荔枝壳，炸后卷曲成形，酸甜汁一裹，形味两似。' },
      { name: '海蛎煎', en: 'Oyster Omelette', icon: 'ic-clam', desc: '地瓜粉要选粗粒，与海蛎同煎，边缘焦脆、内里软糯。闽南夜市的头牌。' },
      { name: '沙茶面', en: 'Satay Noodles', icon: 'ic-noodle', desc: '南洋沙茶酱落地闽南，被改造成更符合本地口味的酱料，如今成了一碗面的灵魂。' },
      { name: '太极芋泥', en: 'Taro Puree', icon: 'ic-cake', desc: '槟榔芋蒸透碾成泥，猪油炒香。表面滚烫、内里温凉，吃急了要烫嘴——据说这是故意的。' },
      { name: '淡糟香螺片', en: 'Wine Lees Whelk Slices', icon: 'ic-abalone', desc: '红糟调味，螺片脆嫩。糟香不抢海鲜本味，是闽菜用糟的分寸感。' },
      { name: '红糟鳗鱼', en: 'Red Lees Eel', icon: 'ic-eel', desc: '红糟腌后油炸，酒香扑鼻。福州人年节里少不了这一味。' },
      { name: '醉排骨', en: 'Drunken Spare Ribs', icon: 'ic-ribs', desc: '酸甜汁临上桌才浇，趁热吃最酥。糖醋比例是每家馆子的秘密。' }
    ],
    trivia: [
      '佛跳墙得名于诗句「坛启荤香飘四邻，佛闻弃禅跳墙来」——连佛都忍不住，凡人更不必说。',
      '红糟是红曲酒酿剩下的酒糟，既上色又去腥增香，是闽菜区别于其他菜系的关键一味。',
      '沙茶源自南洋「沙嗲」，随华侨回传闽南后被本地化：减了椰糖、加了本地香料，成了今天的沙茶酱。'
    ]
  },
  {
    key: 'xiang', char: '湘', name: '湘菜', en: 'Hunan', no: '07',
    tagline: '香辣浓烈', sub: '一把剁椒，火辣人间',
    origin: [
      '湖南三面环山、北向洞庭，夏热冬冷、湿度极重。辣椒驱寒除湿，蒸钵与腊味则是山区储存食物的智慧，久而久之成了口味。',
      '楚地自古「尚滋味」，马王堆汉墓出土的食单中已见羹、炙、脍诸法；明清辣椒传入后，湘菜彻底定型为今天的火辣模样。'
    ],
    flavorDesc: '辣不怕，怕不辣。湘菜之辣重「鲜辣」而非干辣，多用鲜椒与剁椒，重油重色，入口浓烈，回味却干净。',
    tastes: ['香辣', '酸辣', '鲜辣', '干香', '腊香', '豉香', '原汁', '浓香'],
    techs: ['煨', '炖', '腊', '蒸', '炒', '烧', '煎', '熏'],
    dishes: [
      { name: '剁椒鱼头', en: 'Fish Head with Chopped Chili', icon: 'ic-fish', desc: '胖头鱼鱼头铺满剁椒蒸透。鱼肉蘸着底下的汁吃，辣得通透。' },
      { name: '农家小炒肉', en: 'Farmer’s Stir-fried Pork', icon: 'ic-pork', desc: '青椒配五花，猛火快炒，油要足、火要旺。湖南人称它是「省菜」。' },
      { name: '口味虾', en: 'Spicy Crayfish', icon: 'ic-shrimp', desc: '长沙夏夜的江湖。紫苏、蒜蓉与小龙虾同烧，一盆虾配一箱啤酒。' },
      { name: '腊味合蒸', en: 'Steamed Assorted Cured Meat', icon: 'ic-sausage', desc: '腊肉、腊鱼、腊鸡同蒸，油脂互相浸润。这是山区储存智慧结出的美味。' },
      { name: '东安子鸡', en: 'Dong’an Chicken', icon: 'ic-chicken', desc: '米醋与花椒调出酸辣，开胃醒神。这道湘西山区的家常菜，后来上了国宴。' },
      { name: '永州血鸭', en: 'Yongzhou Blood Duck', icon: 'ic-duck', desc: '鸭血裹住每一块肉，成菜紫黑油亮。看似粗犷，实则最讲火候与手速。' },
      { name: '毛氏红烧肉', en: 'Mao’s Braised Pork', icon: 'ic-ribs', desc: '不加一滴酱油，全靠糖色染出红亮。肥肉入口即化，瘦肉不柴。' },
      { name: '长沙臭豆腐', en: 'Changsha Stinky Tofu', icon: 'ic-tofu', desc: '卤水浸泡入味，炸至外焦内嫩，戳开灌上蒜汁辣椒。闻着臭，吃着香。' }
    ],
    trivia: [
      '湖南人吃辣讲究「鲜辣」：多用新鲜辣椒与剁椒，与四川的麻辣、贵州的酸辣各成一派，互不替代。',
      '腊味是山区的储存智慧——入冬杀猪，柴火熏上一个月，一整年的荤腥就有了着落。',
      '「辣椒炒肉」被戏称为湖南省菜，一家一味；谁家做得好吃，是能认真吵起来的话题。'
    ]
  },
  {
    key: 'hui', char: '徽', name: '徽菜', en: 'Anhui', no: '08',
    tagline: '重油浓香', sub: '山珍野味，古徽州味',
    origin: [
      '皖南山区云雾缭绕，盛产竹笋、香菇、石鸡与山蕨。山地劳作消耗大、冬日寒冷，于是养成了重油、重色、重火功的口味。',
      '明清徽商足迹遍天下，徽菜随商帮走出深山；徽州人重礼，民间祭祖有「赛琼碗」习俗，摆席成百上千碗，菜式由此愈发丰富。'
    ],
    flavorDesc: '三重：重油、重酱色、重火功。擅烧擅炖，讲究火候到家——「吃徽菜，吃的是火功」。',
    tastes: ['咸鲜', '浓香', '醇厚', '重油', '微辣', '酱香', '熏香', '本味'],
    techs: ['烧', '炖', '蒸', '熏', '焖', '煨', '卤', '重火功'],
    dishes: [
      { name: '臭鳜鱼', en: 'Stinky Mandarin Fish', icon: 'ic-fish', desc: '淡盐水腌至微臭，热油煎后红烧。鱼肉呈蒜瓣状，一夹即散，异香扑鼻。' },
      { name: '毛豆腐', en: 'Hairy Tofu', icon: 'ic-tofu', desc: '表面长满白色茸毛，油煎至两面金黄，蘸辣酱吃。徽州街头最有辨识度的一味。' },
      { name: '火腿炖鞭笋', en: 'Ham with Bamboo Shoots', icon: 'ic-bamboo', desc: '徽州火腿与六月鞭笋同炖，一咸一鲜，是山里最讲究的搭配。' },
      { name: '李鸿章杂烩', en: 'Li Hongzhang Hotchpotch', icon: 'ic-hotpot', desc: '海参、鱼肚、火腿等一锅烩尽，相传与李鸿章宴客有关，是徽菜里最会变通的一道。' },
      { name: '符离集烧鸡', en: 'Fuliji Roast Chicken', icon: 'ic-chicken', desc: '十三味香料的老汤焖煮，骨酥肉烂，提起鸡腿能整条抽出骨头。' },
      { name: '胡氏一品锅', en: 'Hu’s One-Pot', icon: 'ic-pot', desc: '层层叠放：底层素菜，中层豆腐，上层鸡鸭鱼肉。文火慢煨，越煮越厚。' },
      { name: '清炖马蹄鳖', en: 'Steamed Turtle', icon: 'ic-abalone', desc: '甲鱼清炖，裙边软糯如胶。徽州人视其为滋补上品，火候不到则腥。' },
      { name: '徽州圆子', en: 'Huizhou Rice Meatballs', icon: 'ic-meatball', desc: '糯米裹肉圆蒸透，粒粒晶莹如珠。祭祖与年节时必不可少。' }
    ],
    trivia: [
      '臭鳜鱼是运输的产物：从前鱼贩从江边挑鱼进山要走数日，用淡盐水腌制保鲜，反倒腌出了别样风味。',
      '毛豆腐的白毛是毛霉菌，与腐乳、豆豉同属一类发酵。鲜味来自蛋白质分解出的氨基酸，并非变质。',
      '徽州火腿与金华火腿同源，只因山区气候冷凉，腌制期更长，风味也更浓重。'
    ]
  }
];

/* ================= 模板 ================= */
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8D%9C%3C/text%3E%3C/svg%3E";
const FONTS = 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap';
const STYLE_KEY = 'foodpage-style';

function page(c, prev, next) {
  const dishLi = c.dishes.map((d, i) => `          <li class="dish-item">
            <svg class="dish-ic" aria-hidden="true"><use href="#${d.icon}"/></svg>
            <div class="dish-txt">
              <h3><span class="dish-no">${String(i + 1).padStart(2, '0')}</span>${d.name}<i>${d.en}</i></h3>
              <p>${d.desc}</p>
            </div>
          </li>`).join('\n');

  const tasteTags = c.tastes.map((t) => `<li>${t}</li>`).join('');
  const techTags = c.techs.map((t) => `<li>${t}</li>`).join('');
  const triviaLi = c.trivia.map((t) => `<li>${t}</li>`).join('');
  const originP = c.origin.map((p) => `          <p>${p}</p>`).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="食味人间 · ${c.name}专栏 —— ${c.tagline}。${c.sub}，附 ${c.name}历史渊源、口味技法与八道代表菜详解。">
<title>${c.name}专栏 · 食味人间 · 中华美食志</title>
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
.c-hero h1{font-size:clamp(2.8rem,7vw,4.2rem);font-weight:900;letter-spacing:.08em;line-height:1.15}
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
.c-sec{margin-bottom:3.6rem}
.c-h2{
  display:flex;align-items:baseline;gap:.9rem;
  font-size:1.5rem;font-weight:900;letter-spacing:.1em;
  padding-bottom:.9rem;margin-bottom:1.5rem;border-bottom:1px solid var(--line);
}
.c-h2-no{
  font-family:var(--f-cal);font-size:1.9rem;color:var(--red);
  line-height:1;flex:none;
}
.c-body p{margin-bottom:1.1rem;color:var(--ink);text-align:justify}
.c-lead{margin-bottom:1.6rem;font-size:1.02rem}
.c-tags-wrap{margin-bottom:1.2rem}
.c-tags-label{font-size:.78rem;letter-spacing:.2em;color:var(--ink-2);margin-bottom:.55rem}
.c-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.c-tags li{
  padding:.22rem .85rem;border:1px solid var(--line);border-radius:999px;
  font-size:.86rem;letter-spacing:.06em;background:var(--card);transition:all .3s;
}
.c-tags li:hover{border-color:rgba(178,58,42,.55);color:var(--red)}
.c-tags-alt li{background:transparent;border-style:dashed}

/* 代表菜 */
.dish-list{display:grid;gap:1rem}
.dish-item{
  display:flex;gap:1.1rem;align-items:flex-start;
  padding:1.15rem 1.3rem;background:var(--card);
  border:1px solid var(--line);
  transition:transform .4s cubic-bezier(.2,.8,.3,1), box-shadow .4s, border-color .4s;
}
.dish-item:hover{transform:translateY(-3px);border-color:rgba(178,58,42,.4);box-shadow:0 16px 26px -20px rgba(42,32,24,.5)}
.dish-ic{
  width:38px;height:38px;flex:none;color:var(--red);
  fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
.dish-item h3{font-size:1.08rem;font-weight:900;letter-spacing:.05em;display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}
.dish-no{font-family:var(--f-lat);font-style:italic;color:var(--gold);font-size:1rem;flex:none}
.dish-item h3 i{font-family:var(--f-lat);font-style:italic;font-weight:500;font-size:.82rem;color:var(--ink-2);letter-spacing:.08em}
.dish-item p{margin-top:.35rem;font-size:.92rem;color:var(--ink-2);line-height:1.85}

/* 冷知识 */
.trivia{counter-reset:tv;display:grid;gap:.9rem}
.trivia li{
  counter-increment:tv;position:relative;padding-left:3rem;
  font-size:.95rem;color:var(--ink-2);
}
.trivia li::before{
  content:counter(tv);position:absolute;left:0;top:.1rem;
  width:2rem;height:2rem;display:grid;place-items:center;
  font-family:var(--f-lat);font-style:italic;font-size:1rem;color:var(--red);
  border:1px solid var(--line);border-radius:50%;
}

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
  .dish-item{padding:1rem 1rem;gap:.85rem}
  .dish-ic{width:32px;height:32px}
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
body.xdj .dish-item{
  border:3px solid var(--ink);border-radius:4px;
  box-shadow:5px 6px 0 rgba(61,26,8,.75);
}
body.xdj .dish-item:hover{transform:translateY(-4px) rotate(-.6deg);box-shadow:7px 9px 0 rgba(61,26,8,.8)}
body.xdj .dish-ic{color:var(--red)}
body.xdj .c-tags li{border:2px solid var(--ink);font-weight:700}
body.xdj .trivia li::before{border:2px solid var(--ink);color:var(--red);font-weight:700}
body.xdj .c-nav-btn{border:3px solid var(--ink);font-weight:700;box-shadow:3px 4px 0 rgba(61,26,8,.7)}
body.xdj .c-nav-btn:hover{background:var(--red);color:var(--gold)}
body.xdj .c-nav,.body.xdj .c-footer{border-top:4px solid var(--ink)}
body.xdj .style-switch{background:var(--red);color:#ffe45c;border-color:var(--ink);box-shadow:2px 3px 0 rgba(61,26,8,.8)}
body.xdj .topbar{background:rgba(255,243,208,.94);border-bottom:3px solid var(--ink)}
</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>

<!-- 本页按需内联的菜品图标（从 index.html 图标库抽取） -->
<svg class="defs" aria-hidden="true">
  <defs>
${symbolsFor(c.dishes)}
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
    <span class="c-big" aria-hidden="true">${c.char}</span>
    <p class="c-crumb"><a href="index.html#columns">八大菜系</a><i>/</i>${c.name}</p>
    <p class="c-no">No.${c.no}</p>
    <h1>${c.name}<i>${c.en} Cuisine</i></h1>
    <p class="c-tag">${c.tagline}</p>
    <p class="c-sub">${c.sub}</p>
  </div>
</header>

<main class="container c-main">
  <section class="c-sec rv">
    <h2 class="c-h2"><span class="c-h2-no">壹</span>历史渊源与地理成因</h2>
    <div class="c-body">
${originP}
    </div>
  </section>

  <section class="c-sec rv" style="--d:.08s">
    <h2 class="c-h2"><span class="c-h2-no">贰</span>口味特点与核心技法</h2>
    <p class="c-lead">${c.flavorDesc}</p>
    <div class="c-tags-wrap">
      <p class="c-tags-label">味　型</p>
      <ul class="c-tags">${tasteTags}</ul>
    </div>
    <div class="c-tags-wrap">
      <p class="c-tags-label">技　法</p>
      <ul class="c-tags c-tags-alt">${techTags}</ul>
    </div>
  </section>

  <section class="c-sec rv" style="--d:.16s">
    <h2 class="c-h2"><span class="c-h2-no">叁</span>八道代表菜</h2>
    <ol class="dish-list">
${dishLi}
    </ol>
  </section>

  <section class="c-sec rv" style="--d:.24s">
    <h2 class="c-h2"><span class="c-h2-no">肆</span>冷知识与食俗</h2>
    <ol class="trivia">${triviaLi}</ol>
  </section>
</main>

<nav class="c-nav">
  <div class="container c-nav-in">
    <a class="c-nav-btn" href="cuisine-${prev.key}.html">← ${prev.name}</a>
    <a class="c-nav-btn c-nav-home" href="index.html#columns">返回八大菜系</a>
    <a class="c-nav-btn" href="cuisine-${next.key}.html">${next.name} →</a>
  </div>
</nav>

<footer class="c-footer">
  <div class="container">
    <p>食味人间 · 中华美食志</p>
    <p class="c-footer-sub">纸上食堂，日日开张</p>
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
CUISINES.forEach((c, i) => {
  const prev = CUISINES[(i - 1 + CUISINES.length) % CUISINES.length];
  const next = CUISINES[(i + 1) % CUISINES.length];
  const file = path.join(__dirname, `cuisine-${c.key}.html`);
  fs.writeFileSync(file, page(c, prev, next), 'utf8');
  count++;
});

const lines = [
  `图标库抽取：${iconCount} 个 symbol`,
  `生成专栏页：${count} 个`,
  ...CUISINES.map((c) => `  cuisine-${c.key}.html  ${c.name}  ${c.dishes.length} 道菜  ${(fs.statSync(path.join(__dirname, `cuisine-${c.key}.html`)).size / 1024).toFixed(1)} KB`)
];
console.log(lines.join('\n'));

/**
 * 将棋定跡学習アプリ 初期マスターデータ
 * 管理者ツールによってLocalStorageからクレンジング抽出された自動生成ファイルです。
 */

// インポートパスを型定義の実体である '../types' に修正しました
import { JosekiProblem, JosekiGroup, SubGroup } from '../types';

export const initialTacticsGroups: JosekiGroup[] = [
  {
    "id": "shiken-bisya",
    "name": "四間飛車",
    "description": "攻守のバランスが良く、初心者からプロまで広く愛用される振り飛車の代表格。"
  },
  {
    "id": "sangen-bisya",
    "name": "三間飛車",
    "description": "軽快なさばきを重視し、急戦への対応力に優れた守備力の高い振り飛車。"
  }
];

export const initialTacticsSubGroups: SubGroup[] = [
  {
    "id": "sub-1779881269377",
    "groupId": "shiken-bisya",
    "name": "四間飛車の始め方",
    "description": "自分で追加した戦型です。"
  }
];

export const initialJosekiProblems: JosekiProblem[] = [
  {
    "id": "custom-1779882140870",
    "groupId": "shiken-bisya",
    "subGroupId": "sub-1779881269377",
    "title": "四間飛車の始め方",
    "description": "四間飛車の超基本的な駒組",
    "playerColor": "sente",
    "startStep": 0,
    "moves": [
      {
        "notation": "▲7六歩",
        "from": [
          6,
          2
        ],
        "to": [
          5,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "四間飛車では、最初は角道を開けるのが一般的な駒組みです。",
        "hint": "振り飛車の1手目は角道をあけるのが基本です"
      },
      {
        "notation": "△8四歩",
        "from": [
          2,
          1
        ],
        "to": [
          3,
          1
        ],
        "piece": "歩",
        "promote": false,
        "comment": "後手は居飛車に決めました",
        "hint": ""
      },
      {
        "notation": "▲6八飛",
        "from": [
          7,
          7
        ],
        "to": [
          7,
          3
        ],
        "piece": "飛",
        "promote": false,
        "comment": "これで四間飛車の形です",
        "hint": "さっそく飛車を振りましょう"
      },
      {
        "notation": "△8五歩",
        "from": [
          3,
          1
        ],
        "to": [
          4,
          1
        ],
        "piece": "歩",
        "promote": false,
        "comment": "相手は飛車先を伸ばしてきました",
        "hint": ""
      },
      {
        "notation": "▲7七角",
        "from": [
          7,
          1
        ],
        "to": [
          6,
          2
        ],
        "piece": "角",
        "promote": false,
        "comment": "飛車先の歩を伸ばして来たら▲7七角とするのが定跡です。これで8筋を守れます",
        "hint": "△８六歩▲同歩△同飛車で8筋が突破されてしまいます。\n一番基本的な受け方で守りましょう。"
      },
      {
        "notation": "△3四歩",
        "from": [
          2,
          6
        ],
        "to": [
          3,
          6
        ],
        "piece": "歩",
        "promote": false,
        "comment": "相手は角交換を提案してきました",
        "hint": ""
      },
      {
        "notation": "▲6六歩",
        "from": [
          6,
          3
        ],
        "to": [
          5,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "相手が角道を開けてきたら▲6六歩として、角交換を断るのが定跡です",
        "hint": "7七の角が後手からの飛車の攻めを守っているので、角交換はしないほうがいいです"
      },
      {
        "notation": "△6二銀",
        "from": [
          0,
          2
        ],
        "to": [
          1,
          3
        ],
        "piece": "銀",
        "promote": false,
        "comment": "これ以上攻めの手は無いので、後手は駒組を始めます",
        "hint": ""
      },
      {
        "notation": "▲7八銀",
        "from": [
          8,
          2
        ],
        "to": [
          7,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "ここまでの流れが四間飛車の初歩的なな駒組です",
        "hint": "相手が銀を動かしたときはこちらも銀を動かしましょう"
      }
    ],
    // SRSStatus型に定義されていない levelStatus / nextReviewDateClean プロパティを完全に排除し、エラーを解消しました
    "srs": {
      "stage": 0,
      "interval": 0,
      "nextReviewDate": null,
      "lastReviewedAt": null
    }
  },
  {
    "id": "custom-1779887145151",
    "groupId": "shiken-bisya",
    "subGroupId": "sub-1779881269377",
    "title": "美濃囲いを組もう",
    "description": "美濃囲いを組んで玉を安全にしよう",
    "playerColor": "sente",
    "startStep": 9,
    "moves": [
      {
        "notation": "▲7六歩",
        "from": [
          6,
          2
        ],
        "to": [
          5,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△8四歩",
        "from": [
          2,
          1
        ],
        "to": [
          3,
          1
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲6八飛",
        "from": [
          7,
          7
        ],
        "to": [
          7,
          3
        ],
        "piece": "飛",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△8五歩",
        "from": [
          3,
          1
        ],
        "to": [
          4,
          1
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲7七角",
        "from": [
          7,
          1
        ],
        "to": [
          6,
          2
        ],
        "piece": "角",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△3四歩",
        "from": [
          2,
          6
        ],
        "to": [
          3,
          6
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲6六歩",
        "from": [
          6,
          3
        ],
        "to": [
          5,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△6二銀",
        "from": [
          0,
          2
        ],
        "to": [
          1,
          3
        ],
        "piece": "銀",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲7八銀",
        "from": [
          8,
          2
        ],
        "to": [
          7,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△4二玉",
        "from": [
          0,
          4
        ],
        "to": [
          1,
          5
        ],
        "piece": "玉",
        "promote": false,
        "comment": "後手は玉を囲いにいきました\n戦いが左側で起こりそうなので玉を右側に持って行くのが定跡です",
        "hint": ""
      },
      {
        "notation": "▲4八玉",
        "from": [
          8,
          4
        ],
        "to": [
          7,
          5
        ],
        "piece": "玉",
        "promote": false,
        "comment": "こちらも玉を囲いにいきます。\n相手が玉を動かしたときにこちらも玉を動かすのが覚えやすく間違えにくいです",
        "hint": "相手が玉を動かしたら、こちらも玉を囲いに行きます"
      },
      {
        "notation": "△3二玉",
        "from": [
          1,
          5
        ],
        "to": [
          1,
          6
        ],
        "piece": "玉",
        "promote": false,
        "comment": "後手はさらに深く玉を安全場所に動かす",
        "hint": ""
      },
      {
        "notation": "▲3八銀",
        "from": [
          8,
          6
        ],
        "to": [
          7,
          6
        ],
        "piece": "銀",
        "promote": false,
        "comment": "3八銀・４九金の形を「片美濃囲い」という\n玉には玉で▲3八玉でもいいが、先に▲3八銀で片美濃囲いの形を作っておくほうが安全",
        "hint": "3八銀で囲いの形をつくろう"
      },
      {
        "notation": "△5二金",
        "from": [
          0,
          3
        ],
        "to": [
          1,
          4
        ],
        "piece": "金",
        "promote": false,
        "comment": "後手はとりあえず「船囲い」という形に、ここからさまざまな囲いに発展したり、この形のまま急戦にしたりすることができる",
        "hint": ""
      },
      {
        "notation": "▲5八金",
        "from": [
          8,
          3
        ],
        "to": [
          7,
          4
        ],
        "piece": "金",
        "promote": false,
        "comment": "５二金には5八金で覚えれば間違いにくく覚えやすい。\nこれでこちらの守りの金銀の形は「美濃囲い」になったので、あとは玉は2八に持って行けば囲いの完成",
        "hint": "金には金"
      },
      {
        "notation": "△5四歩",
        "from": [
          2,
          4
        ],
        "to": [
          3,
          4
        ],
        "piece": "歩",
        "promote": false,
        "comment": "銀を５三にもっていくための歩突き\nまた急戦にするか持久戦にするか様子見の手",
        "hint": ""
      },
      {
        "notation": "▲3九玉",
        "from": [
          7,
          5
        ],
        "to": [
          8,
          6
        ],
        "piece": "玉",
        "promote": false,
        "comment": "他にすることが無いので、玉を囲いにもっていく",
        "hint": "こちらの目標は玉を囲うこと"
      },
      {
        "notation": "△5三銀",
        "from": [
          1,
          3
        ],
        "to": [
          2,
          4
        ],
        "piece": "銀",
        "promote": false,
        "comment": "6四銀からの急戦の準備をすすめておいて、\nまだ急戦・持久戦どちらにするか様子見",
        "hint": ""
      },
      {
        "notation": "▲2八玉",
        "from": [
          8,
          6
        ],
        "to": [
          7,
          7
        ],
        "piece": "玉",
        "promote": false,
        "comment": "「美濃囲い」完成\nこの囲いは横からの攻めに強く、左側で強く戦えるようになる",
        "hint": "囲いを完成させよう"
      },
      {
        "notation": "△1四歩",
        "from": [
          2,
          8
        ],
        "to": [
          3,
          8
        ],
        "piece": "歩",
        "promote": false,
        "comment": "端歩を突いて様子見",
        "hint": ""
      },
      {
        "notation": "▲1六歩",
        "from": [
          6,
          8
        ],
        "to": [
          5,
          8
        ],
        "piece": "歩",
        "promote": false,
        "comment": "端歩は必ず突き返しておく\n美濃囲いは端歩を突いておかないと詰みやすいので、必ず覚えておこう",
        "hint": "格言「端歩はあいさつ」"
      }
    ],
    // SRSStatus型に定義されていない levelStatus / nextReviewDateClean プロパティを完全に排除し、エラーを解消しました
    "srs": {
      "stage": 0,
      "interval": 0,
      "nextReviewDate": null,
      "lastReviewedAt": null
    }
  },
  {
    "id": "custom-1779947368372",
    "groupId": "shiken-bisya",
    "subGroupId": "sub-1779881269377",
    "title": "対棒銀",
    "description": "後手の棒銀をさばこう",
    "playerColor": "sente",
    "startStep": 15,
    "moves": [
      {
        "notation": "▲7六歩",
        "from": [6, 2],
        "to": [5, 2],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△8四歩",
        "from": [2, 1],
        "to": [3, 1],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲6八飛",
        "from": [7, 7],
        "to": [7, 3],
        "piece": "飛",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△8五歩",
        "from": [3, 1],
        "to": [4, 1],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲7七角",
        "from": [7, 1],
        "to": [6, 2],
        "piece": "角",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△3四歩",
        "from": [2, 6],
        "to": [3, 6],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲6六歩",
        "from": [6, 3],
        "to": [5, 3],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△6二銀",
        "from": [0, 2],
        "to": [1, 3],
        "piece": "銀",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲7八銀",
        "from": [8, 2],
        "to": [7, 2],
        "piece": "銀",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△4二玉",
        "from": [0, 4],
        "to": [1, 5],
        "piece": "玉",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲4八玉",
        "from": [8, 4],
        "to": [7, 5],
        "piece": "玉",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△3二玉",
        "from": [1, 5],
        "to": [1, 6],
        "piece": "玉",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲3八銀",
        "from": [8, 6],
        "to": [7, 6],
        "piece": "銀",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△5二金",
        "from": [0, 3],
        "to": [1, 4],
        "piece": "金",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲5八金",
        "from": [8, 3],
        "to": [7, 4],
        "piece": "金",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△7四歩",
        "from": [2, 2],
        "to": [3, 2],
        "piece": "歩",
        "promote": false,
        "comment": "後手が速攻で棒銀を仕掛けてきた場合の対処を見ていく",
        "hint": ""
      },
      {
        "notation": "▲3九玉",
        "from": [7, 5],
        "to": [8, 6],
        "piece": "玉",
        "promote": false,
        "comment": "あせらず玉を安全にしておく",
        "hint": "振り飛車の目標は、やはり玉を囲うこと"
      },
      {
        "notation": "△7三銀",
        "from": [1, 3],
        "to": [2, 2],
        "piece": "銀",
        "promote": false,
        "comment": "7三銀までくれば、ほぼ間違いなく速攻をしかけてくる",
        "hint": ""
      },
      {
        "notation": "▲2八玉",
        "from": [8, 6],
        "to": [7, 7],
        "piece": "玉",
        "promote": false,
        "comment": "これで玉はかなり安全にできたので、ここからカウンターを狙っていく",
        "hint": "この1手を指しておけば、強く戦える"
      },
      {
        "notation": "△8四銀",
        "from": [2, 2],
        "to": [3, 1],
        "piece": "銀",
        "promote": false,
        "comment": "典型的な棒銀戦法\n後手は△7五歩▲同歩△同銀　で角頭を攻めつつ８筋突破を狙ってる",
        "hint": ""
      },
      {
        "notation": "▲6五歩",
        "from": [5, 3],
        "to": [4, 3],
        "piece": "歩",
        "promote": false,
        "comment": "この1手で飛車先をのばし角道が開く味のいい手。\n四間飛車では6五歩のタイミングが重要なので、ここからの攻めの感覚を覚えて、自分の武器にしよう",
        "hint": "受けずに反撃をしていく。\n\n大駒（飛車・角）を活用してさばきを狙う一手"
      },
      {
        "notation": "△7五歩",
        "from": [3, 2],
        "to": [4, 2],
        "piece": "歩",
        "promote": false,
        "comment": "後手は予定通り角頭を攻めてきた",
        "hint": ""
      },
      {
        "notation": "▲6四歩",
        "from": [4, 3],
        "to": [3, 3],
        "piece": "歩",
        "promote": false,
        "comment": "飛車先の歩を突いて、さらに飛車を活用していく",
        "hint": "▲同歩△同銀とすると相手の攻めを加速させてるだけになる。\nここでの攻めの1手は？"
      },
      {
        "notation": "△6四歩",
        "from": [2, 3],
        "to": [3, 3],
        "piece": "歩",
        "promote": false,
        "comment": "▲6三歩成が厳しいので後手は一度受けるしかない。\n",
        "hint": ""
      },
      {
        "notation": "▲6四飛",
        "from": [7, 3],
        "to": [3, 3],
        "piece": "飛",
        "promote": false,
        "comment": "当然の一手\nここまで来れば振り飛車側が軽快で調子がいい\n",
        "hint": "取られた歩を取り返す"
      },
      {
        "notation": "△6三歩打",
        "from": null,
        "to": [2, 3],
        "piece": "歩",
        "promote": false,
        "comment": "6一飛車成を受けた手",
        "hint": ""
      },
      {
        "notation": "▲3四飛",
        "from": [3, 3],
        "to": [3, 6],
        "piece": "飛",
        "promote": false,
        "comment": "王手で歩を取る気持ちのいい手\n後手は持ち駒が無いのでこの王手に対して、良い守りの手が無い",
        "hint": "飛車を動かさないと取られるので飛車を動かす手\n一番厳しい攻めの手は？"
      },
      {
        "notation": "△3三角",
        "from": [1, 7],
        "to": [2, 6],
        "piece": "角",
        "promote": false,
        "comment": "3三角で守ってきた",
        "hint": ""
      },
      {
        "notation": "▲3三角成",
        "from": [6, 2],
        "to": [2, 6],
        "piece": "角",
        "promote": true,
        "comment": "角交換で角を持ち駒にしてから、次に狙いの一手",
        "hint": "3手一組のとどめの手筋がある。\n角をつかう手"
      },
      {
        "notation": "△3三桂",
        "from": [0, 7],
        "to": [2, 6],
        "piece": "桂",
        "promote": false,
        "comment": "強制手。\n後手は同桂以外指せない",
        "hint": ""
      },
      {
        "notation": "▲5五角打",
        "from": null,
        "to": [4, 4],
        "piece": "角",
        "promote": false,
        "comment": "とどめの一撃！\n飛車と桂馬の両取り",
        "hint": "持ち駒の角を打つ手"
      },
      {
        "notation": "△2二銀",
        "from": [0, 6],
        "to": [1, 7],
        "piece": "銀",
        "promote": false,
        "comment": "後手がなんらかの飛車を取られないようにする手を指すと、▲3三飛車成△2一玉▲２三龍△22角打▲3三桂打で詰むので、後手は飛車を捨てるしかありません",
        "hint": ""
      },
      {
        "notation": "▲8二角成",
        "from": [4, 4],
        "to": [1, 1],
        "piece": "角",
        "promote": true,
        "comment": "",
        "hint": ""
      }
    ],
    "finalComment": "",
    "srs": {
      "stage": 0,
      "interval": 0,
      "nextReviewDate": null,
      "lastReviewedAt": null
    }
  }
];
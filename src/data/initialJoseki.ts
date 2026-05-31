/**
 * 将棋定跡学習アプリ 初期マスターデータ
 * 管理者ツールによってLocalStorageからクレンジング抽出された自動生成ファイルです。
 */

import { JosekiProblem, JosekiGroup, SubGroup } from '../types/shogi';

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
    "title": "四間飛車の始め方 先手番",
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
    "finalComment": "",
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
    "title": "美濃囲いを組もう　先手番",
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
        "comment": "3八銀・４九金の形を「片美濃囲い」という\n玉には玉で▲3八玉でもいいが、先に▲3八銀で片美濃囲いの形を作っておくほうが安全なことが多い",
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
    "finalComment": "",
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
    "title": "対棒銀1　先手番",
    "description": "後手の棒銀をさばこう",
    "playerColor": "sente",
    "startStep": 15,
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
        "comment": "",
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
        "comment": "",
        "hint": ""
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
        "comment": "",
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
        "comment": "",
        "hint": ""
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
        "comment": "",
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
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△7四歩",
        "from": [
          2,
          2
        ],
        "to": [
          3,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "後手が速攻で棒銀を仕掛けてきた場合の対処を見ていく",
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
        "comment": "あせらず玉を安全にしておく",
        "hint": "振り飛車の目標は、やはり玉を囲うこと"
      },
      {
        "notation": "△7三銀",
        "from": [
          1,
          3
        ],
        "to": [
          2,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "7三銀までくれば、ほぼ間違いなく速攻をしかけてくる",
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
        "comment": "これで玉はかなり安全にできたので、ここからカウンターを狙っていく",
        "hint": "この1手を指しておけば、強く戦える"
      },
      {
        "notation": "△8四銀",
        "from": [
          2,
          2
        ],
        "to": [
          3,
          1
        ],
        "piece": "銀",
        "promote": false,
        "comment": "典型的な棒銀戦法\n後手は△7五歩▲同歩△同銀　で角頭を攻めつつ８筋突破を狙ってる",
        "hint": ""
      },
      {
        "notation": "▲6五歩",
        "from": [
          5,
          3
        ],
        "to": [
          4,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "この1手で飛車先をのばし角道が開く味のいい手。\n四間飛車では6五歩のタイミングが重要なので、ここからの攻めの感覚を覚えて、自分の武器にしよう",
        "hint": "受けずに反撃をしていく。\n\n大駒（飛車・角）を活用してさばきを狙う一手"
      },
      {
        "notation": "△7五歩",
        "from": [
          3,
          2
        ],
        "to": [
          4,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "後手は予定通り角頭を攻めてきた\n後手が角交換してきた場合は「対棒銀3」でみていく\n",
        "hint": ""
      },
      {
        "notation": "▲6四歩",
        "from": [
          4,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "飛車先の歩を突いて、さらに飛車を活用していく",
        "hint": "▲同歩△同銀とすると相手の攻めを加速させてるだけになる。\nここでの攻めの1手は？"
      },
      {
        "notation": "△6四歩",
        "from": [
          2,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "▲6三歩成が厳しいので後手は一度受けるしかない。\n",
        "hint": ""
      },
      {
        "notation": "▲6四飛",
        "from": [
          7,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "飛",
        "promote": false,
        "comment": "当然の一手\nここまで来れば振り飛車側が軽快で調子がいい\n",
        "hint": "取られた歩を取り返す"
      },
      {
        "notation": "△6三歩打",
        "from": null,
        "to": [
          2,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "6一飛車成を受けた手\n△51金寄と受けてきたら▲3四飛△3三歩▲７四飛から飛車成を狙ったり、後手の7五の歩を取ったり、▲5五角で後手の飛車をいじめたりすることができて、後手からは何もできないので振り飛車優勢",
        "hint": ""
      },
      {
        "notation": "▲3四飛",
        "from": [
          3,
          3
        ],
        "to": [
          3,
          6
        ],
        "piece": "飛",
        "promote": false,
        "comment": "王手で歩を取る気持ちのいい手\n後手は持ち駒が無いのでこの王手に対して、良い守りの手が無い",
        "hint": "飛車を動かさないと取られるので飛車を動かす手\n一番厳しい攻めの手は？"
      },
      {
        "notation": "△3三角",
        "from": [
          1,
          7
        ],
        "to": [
          2,
          6
        ],
        "piece": "角",
        "promote": false,
        "comment": "3三角で守ってきた。\n3三桂の場合は「対棒銀２」でみていく",
        "hint": ""
      },
      {
        "notation": "▲3三角成",
        "from": [
          6,
          2
        ],
        "to": [
          2,
          6
        ],
        "piece": "角",
        "promote": true,
        "comment": "角交換で角を持ち駒にしてから、次に狙いの一手",
        "hint": "3手一組のとどめの手筋がある。\n角をつかう手"
      },
      {
        "notation": "△3三桂",
        "from": [
          0,
          7
        ],
        "to": [
          2,
          6
        ],
        "piece": "桂",
        "promote": false,
        "comment": "強制手。\n後手は同桂以外指せない",
        "hint": ""
      },
      {
        "notation": "▲5五角打",
        "from": null,
        "to": [
          4,
          4
        ],
        "piece": "角",
        "promote": false,
        "comment": "とどめの一撃！\n飛車と桂馬の両取り\n後手が飛車を取られないようにする手を指すと、▲3三飛車成△2一玉▲２三龍△22角打▲3三桂打で詰むので、後手は飛車を捨てるしかない",
        "hint": "持ち駒の角を打つ手"
      },
      {
        "notation": "△2二銀",
        "from": [
          0,
          6
        ],
        "to": [
          1,
          7
        ],
        "piece": "銀",
        "promote": false,
        "comment": "後手玉の詰みを受けた手",
        "hint": ""
      },
      {
        "notation": "▲8二角成",
        "from": [
          4,
          4
        ],
        "to": [
          1,
          1
        ],
        "piece": "角",
        "promote": true,
        "comment": "飛車を取って優勢\n",
        "hint": ""
      }
    ],
    "finalComment": "ここまでキレイに反撃できることはめったにないが、こういう感覚を身に着けていくことで実戦でもさばいていけるようになる。",
    "srs": {
      "stage": 0,
      "interval": 0,
      "nextReviewDate": null,
      "lastReviewedAt": null
    }
  },
  {
    "id": "custom-1780028458435",
    "groupId": "shiken-bisya",
    "subGroupId": "sub-1779881269377",
    "title": "対棒銀2　先手番",
    "description": "△3三桂で守ってきた場合",
    "playerColor": "sente",
    "startStep": 27,
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
        "comment": "",
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
        "comment": "",
        "hint": ""
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
        "comment": "",
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
        "comment": "",
        "hint": ""
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
        "comment": "",
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
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△7四歩",
        "from": [
          2,
          2
        ],
        "to": [
          3,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "後手が速攻で棒銀を仕掛けてきた場合の対処を見ていく",
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
        "comment": "あせらず玉を安全にしておく",
        "hint": "振り飛車の目標は、やはり玉を囲うこと"
      },
      {
        "notation": "△7三銀",
        "from": [
          1,
          3
        ],
        "to": [
          2,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "7三銀までくれば、ほぼ間違いなく速攻をしかけてくる",
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
        "comment": "これで玉はかなり安全にできたので、ここからカウンターを狙っていく",
        "hint": "この1手を指しておけば、強く戦える"
      },
      {
        "notation": "△8四銀",
        "from": [
          2,
          2
        ],
        "to": [
          3,
          1
        ],
        "piece": "銀",
        "promote": false,
        "comment": "典型的な棒銀戦法\n後手は△7五歩▲同歩△同銀　で角頭を攻めつつ８筋突破を狙ってる",
        "hint": ""
      },
      {
        "notation": "▲6五歩",
        "from": [
          5,
          3
        ],
        "to": [
          4,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "この1手で飛車先をのばし角道が開く味のいい手。\n四間飛車では6五歩のタイミングが重要なので、ここからの攻めの感覚を覚えて、自分の武器にしよう",
        "hint": "受けずに反撃をしていく。\n\n大駒（飛車・角）を活用してさばきを狙う一手"
      },
      {
        "notation": "△7五歩",
        "from": [
          3,
          2
        ],
        "to": [
          4,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "後手は予定通り角頭を攻めてきた\n後手が角交換してきた場合は「対棒銀3」でみていく\n",
        "hint": ""
      },
      {
        "notation": "▲6四歩",
        "from": [
          4,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "飛車先の歩を突いて、さらに飛車を活用していく",
        "hint": "▲同歩△同銀とすると相手の攻めを加速させてるだけになる。\nここでの攻めの1手は？"
      },
      {
        "notation": "△6四歩",
        "from": [
          2,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "▲6三歩成が厳しいので後手は一度受けるしかない。\n",
        "hint": ""
      },
      {
        "notation": "▲6四飛",
        "from": [
          7,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "飛",
        "promote": false,
        "comment": "当然の一手\nここまで来れば振り飛車側が快調で調子がいい\n",
        "hint": "取られた歩を取り返す"
      },
      {
        "notation": "△6三歩打",
        "from": null,
        "to": [
          2,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "6一飛車成を受けた手\n△51金寄と受けてきたら▲3四飛△3三歩▲７四飛から飛車成を狙ったり、後手の7五の歩を取ったり、▲5五角で後手の飛車をいじめたりすることができて、後手からは何もできないので振り飛車優勢",
        "hint": ""
      },
      {
        "notation": "▲3四飛",
        "from": [
          3,
          3
        ],
        "to": [
          3,
          6
        ],
        "piece": "飛",
        "promote": false,
        "comment": "王手で歩を取る気持ちのいい手\n後手は持ち駒が無いのでこの王手に対して、良い守りの手が無い",
        "hint": "飛車を動かさないと取られるので飛車を動かす手\n一番厳しい攻めの手は？"
      },
      {
        "notation": "△3三桂",
        "from": [
          0,
          7
        ],
        "to": [
          2,
          6
        ],
        "piece": "桂",
        "promote": false,
        "comment": "この局面はすでに優勢だが、初心者にとってはまだまだこれからの局面なのでこの変化も解説しておく",
        "hint": ""
      },
      {
        "notation": "▲3三角成",
        "from": [
          6,
          2
        ],
        "to": [
          2,
          6
        ],
        "piece": "角",
        "promote": true,
        "comment": "角と桂の交換で駒損に見えるが",
        "hint": "角を使う「対棒銀1」の時と似た技がある"
      },
      {
        "notation": "△3三角",
        "from": [
          1,
          7
        ],
        "to": [
          2,
          6
        ],
        "piece": "角",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲3三飛成",
        "from": [
          3,
          6
        ],
        "to": [
          2,
          6
        ],
        "piece": "飛",
        "promote": true,
        "comment": "駒損で攻め駒もなくなっただけに見えるが…",
        "hint": "飛車で角を取るとどうなる？"
      },
      {
        "notation": "△3三玉",
        "from": [
          1,
          6
        ],
        "to": [
          2,
          6
        ],
        "piece": "玉",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲5五角打",
        "from": null,
        "to": [
          4,
          4
        ],
        "piece": "角",
        "promote": false,
        "comment": "王手飛車！",
        "hint": "将棋で一番気持ちのいい手！"
      },
      {
        "notation": "△4四角打",
        "from": null,
        "to": [
          3,
          5
        ],
        "piece": "角",
        "promote": false,
        "comment": "「角には角」で受ける\n△9九角成の香取りもねらってる",
        "hint": ""
      },
      {
        "notation": "▲8二角成",
        "from": [
          4,
          4
        ],
        "to": [
          1,
          1
        ],
        "piece": "角",
        "promote": true,
        "comment": "何も気にせず駒得できる飛車取りが正解。角を取るとただの角交換で終わって、駒損が残るだけになる。",
        "hint": "飛車と角どっちをとる？"
      },
      {
        "notation": "△9九角成",
        "from": [
          3,
          5
        ],
        "to": [
          8,
          0
        ],
        "piece": "角",
        "promote": true,
        "comment": "後手精一杯 of 反撃",
        "hint": ""
      },
      {
        "notation": "▲9一馬",
        "from": [
          1,
          1
        ],
        "to": [
          0,
          0
        ],
        "piece": "馬",
        "promote": false,
        "comment": "後手の攻めに恐れるところは無いので、気にせず駒を取っていく",
        "hint": "後手の攻めに恐れるところは無い"
      },
      {
        "notation": "△8八馬",
        "from": [
          8,
          0
        ],
        "to": [
          7,
          1
        ],
        "piece": "馬",
        "promote": false,
        "comment": "ここからは一例だが分かりやすく進めてみる。\n後手は銀をとろうとしてる",
        "hint": ""
      },
      {
        "notation": "▲3六香打",
        "from": null,
        "to": [
          5,
          6
        ],
        "piece": "香",
        "promote": false,
        "comment": "この一手で後手玉がかなり制限される（3五香でもいっしょ）。\nこの手以外にも、8二飛や8三飛打ち（銀・桂両取り）や７一飛車打ち（金・桂両取り）とか、７七銀や４六馬などのいい手はたくさんある",
        "hint": "王手の手で探してみよう"
      },
      {
        "notation": "△4二玉",
        "from": [
          2,
          6
        ],
        "to": [
          1,
          5
        ],
        "piece": "玉",
        "promote": false,
        "comment": "浮いてた４一の金に紐づけつつ逃げる",
        "hint": ""
      },
      {
        "notation": "▲8二飛打",
        "from": null,
        "to": [
          1,
          1
        ],
        "piece": "飛",
        "promote": false,
        "comment": "後手玉を間接的に睨みつつ、銀桂両取り",
        "hint": "飛車を打つ手を考えよう"
      },
      {
        "notation": "△7八馬",
        "from": [
          7,
          1
        ],
        "to": [
          7,
          2
        ],
        "piece": "馬",
        "promote": false,
        "comment": "守る手もないので銀を取る",
        "hint": ""
      },
      {
        "notation": "▲8一飛成",
        "from": [
          1,
          1
        ],
        "to": [
          0,
          1
        ],
        "piece": "飛",
        "promote": true,
        "comment": "後手玉への圧が高い桂取りの方が正解",
        "hint": "銀と桂どっちをとる？"
      },
      {
        "notation": "△3三香打",
        "from": null,
        "to": [
          2,
          6
        ],
        "piece": "香",
        "promote": false,
        "comment": "香の効きをさえぎって、玉の逃げ道を確保しておく",
        "hint": ""
      },
      {
        "notation": "▲5五馬",
        "from": [
          0,
          0
        ],
        "to": [
          4,
          4
        ],
        "piece": "馬",
        "promote": false,
        "comment": "冷静な馬引き、▲3三馬までの詰めろ",
        "hint": "働いていない馬を活用したい"
      },
      {
        "notation": "△3六香",
        "from": [
          2,
          6
        ],
        "to": [
          5,
          6
        ],
        "piece": "香",
        "promote": false,
        "comment": "詰みを解除",
        "hint": ""
      },
      {
        "notation": "▲4五桂打",
        "from": null,
        "to": [
          4,
          5
        ],
        "piece": "桂",
        "promote": false,
        "comment": "詰みを見せて圧をかけ続ける",
        "hint": "3三のマスに効きを足して、もう一度詰めろをかけよう。桂を打つ手"
      },
      {
        "notation": "△3二銀",
        "from": [
          0,
          6
        ],
        "to": [
          1,
          6
        ],
        "piece": "銀",
        "promote": false,
        "comment": "後手も3三に応援を送るが",
        "hint": ""
      },
      {
        "notation": "▲3四桂打",
        "from": null,
        "to": [
          3,
          6
        ],
        "piece": "桂",
        "promote": false,
        "comment": "",
        "hint": "三手詰がある"
      },
      {
        "notation": "△3一玉",
        "from": [
          1,
          5
        ],
        "to": [
          0,
          6
        ],
        "piece": "玉",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲2二馬",
        "from": [
          4,
          4
        ],
        "to": [
          1,
          7
        ],
        "piece": "馬",
        "promote": false,
        "comment": "",
        "hint": ""
      }
    ],
    "finalComment": "やはり、ここまでキレイに勝つことは滅多にないが、有利の活かしかたの参考にはなったと思う",
    "srs": {
      "stage": 0,
      "interval": 0,
      "nextReviewDate": null,
      "lastReviewedAt": null
    }
  },
  {
    "id": "custom-1780033819552",
    "groupId": "shiken-bisya",
    "subGroupId": "sub-1779881269377",
    "title": "対棒銀3　先手番 ",
    "description": "後手の棒銀をさばこう",
    "playerColor": "sente",
    "startStep": 21,
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
        "notation": "△8防歩",
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
        "comment": "",
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
        "comment": "",
        "hint": ""
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
        "comment": "",
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
        "comment": "",
        "hint": ""
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
        "comment": "",
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
        "comment": "",
        "hint": ""
      },
      {
        "notation": "△7四歩",
        "from": [
          2,
          2
        ],
        "to": [
          3,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "後手が速攻で棒銀を仕掛けてきた場合の対処を見ていく",
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
        "comment": "あせらず玉を安全にしておく",
        "hint": "振り飛車の目標は、やはり玉を囲うこと"
      },
      {
        "notation": "△7三銀",
        "from": [
          1,
          3
        ],
        "to": [
          2,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "7三銀までくれば、ほぼ間違いなく速攻をしかけてくる",
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
        "comment": "これで玉はかなり安全にできたので、ここからカウンターを狙っていく",
        "hint": "この1手を指しておけば、強く戦える"
      },
      {
        "notation": "△8四銀",
        "from": [
          2,
          2
        ],
        "to": [
          3,
          1
        ],
        "piece": "銀",
        "promote": false,
        "comment": "典型的な棒銀戦法\n後手は△7五歩▲同歩△同銀　で角頭を攻めつつ８筋突破を狙ってる",
        "hint": ""
      },
      {
        "notation": "▲6五歩",
        "from": [
          5,
          3
        ],
        "to": [
          4,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "この1手で飛車先をのばし角道が開く味のいい手。\n四間飛車では6五歩のタイミングが重要なので、ここからの攻めの感覚を覚えて、自分の武器にしよう",
        "hint": "受けずに反撃をしていく。\n\n大駒（飛車・角）を活用してさばきを狙う一手"
      },
      {
        "notation": "△7七角成",
        "from": [
          1,
          7
        ],
        "to": [
          6,
          2
        ],
        "piece": "角",
        "promote": true,
        "comment": "角交換をしたうえで、後手が棒銀で攻めて来る場合を見ていく",
        "hint": ""
      },
      {
        "notation": "▲7七銀",
        "from": [
          7,
          2
        ],
        "to": [
          6,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "同銀も同桂どちらもありだが、初心者には同銀の方がおすすめ。",
        "hint": ""
      },
      {
        "notation": "△2二銀",
        "from": [
          0,
          6
        ],
        "to": [
          1,
          7
        ],
        "piece": "銀",
        "promote": false,
        "comment": "▲5五角打の飛車香両取りを防いだ手",
        "hint": ""
      },
      {
        "notation": "▲6四歩",
        "from": [
          4,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "飛車先の歩を交換して飛車を軽くしておく狙い",
        "hint": "飛車を使うための歩突き"
      },
      {
        "notation": "△6四歩",
        "from": [
          2,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲6四飛",
        "from": [
          7,
          3
        ],
        "to": [
          3,
          3
        ],
        "piece": "飛",
        "promote": false,
        "comment": "",
        "hint": "当然の1手"
      },
      {
        "notation": "△6三歩打",
        "from": null,
        "to": [
          2,
          3
        ],
        "piece": "歩",
        "promote": false,
        "comment": "",
        "hint": ""
      },
      {
        "notation": "▲6八飛",
        "from": [
          3,
          3
        ],
        "to": [
          7,
          3
        ],
        "piece": "飛",
        "promote": false,
        "comment": "7八角打を消しつつ、飛車による6筋の圧を残しておく。▲3四飛は王手で気持ちよさそうだが、その後△3三銀▲3五飛△7八角で、まだ互角ではあるがペースは握られる展開",
        "hint": "後手には7八角打ちの狙いがある。"
      },
      {
        "notation": "△7五歩",
        "from": [
          3,
          2
        ],
        "to": [
          4,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "ここで後手が執念深く7五歩で攻めてきたらどうなるかみていく",
        "hint": ""
      },
      {
        "notation": "▲4六角打",
        "from": null,
        "to": [
          5,
          5
        ],
        "piece": "角",
        "promote": false,
        "comment": "この角打ちで、相手の飛車を悪い位置に動かすか、相手の銀を下がらせることができる。",
        "hint": "持ち駒の角で相手 of 飛車を攻撃しよう"
      },
      {
        "notation": "△7三角打",
        "from": null,
        "to": [
          2,
          2
        ],
        "piece": "角",
        "promote": false,
        "comment": "格言「角には角」",
        "hint": ""
      },
      {
        "notation": "▲7三角成",
        "from": [
          5,
          5
        ],
        "to": [
          2,
          2
        ],
        "piece": "角",
        "promote": true,
        "comment": "角を取って銀を下げさせる",
        "hint": "相手の銀を下げさせるためには？"
      },
      {
        "notation": "△7三銀",
        "from": [
          3,
          1
        ],
        "to": [
          2,
          2
        ],
        "piece": "銀",
        "promote": false,
        "comment": "もし桂馬で取り返したときは、△7三同桂▲7五歩△同銀▲7四歩で桂馬がとれる",
        "hint": ""
      },
      {
        "notation": "▲7五歩",
        "from": [
          5,
          2
        ],
        "to": [
          4,
          2
        ],
        "piece": "歩",
        "promote": false,
        "comment": "これで後手の棒銀を完全に抑えれた。\n玉の安全度、歩の枚数などをみれば振り飛車がだいぶ勝ちやすい形勢だ。\n１六歩を入れて玉をさらに安全にしてから、6七金から７六金、8八飛車などで、相手を抑えこみながらゆっくり勝ちに行けばいい。",
        "hint": "ここで手を戻す"
      }
    ],
    "finalComment": "ここまで進めれた人なら後手の単純な船囲いの棒銀には勝てるようになっただろう",
    "srs": {
      "stage": 0,
      "interval": 0,
      "nextReviewDate": null,
      "lastReviewedAt": null
    }
  }
];
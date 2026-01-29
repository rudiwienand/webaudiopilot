// Audio Configuration
// You can specify URLs to your hosted audio files here

export interface AudioConfig {
  [chakraId: number]: {
    [trackId: number]: string; // URL to the audio file
  };
}

// OPTION 1: Use external URLs (recommended for Figma Make)
// Replace these URLs with links to your own hosted MP3 files
// You can use services like: Dropbox, Google Drive (with direct link), AWS S3, or any CDN
export const audioConfig: AudioConfig = {
  1: { // Root Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/x1o6cuae9zj6xmisfhww3/track-1.mp3?rlkey=6wmqkyr9041h273o492iy8u5r&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/k4qhpv3efxiz4g4rtcxf3/track-2.mp3?rlkey=f7593q3pca9jkjrniuvw8citq&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/f2qx9avi9kgeefgd8jwtu/track-3.mp3?rlkey=03ahxm7fetqpx0t0cnfiqpdf7&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/u5hudmmxexbhheyy02gf9/track-4.mp3?rlkey=qe3uy5fo8d4rxmn2co6tiantq&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/g2rr4jozhh5sfdie1q2au/track-5.mp3?rlkey=9q7wjubd9ax7p7vxuhznwz9t8&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/l6dlerqq86m6sotpuhcyj/track-6.mp3?rlkey=5gn7gfmovnqincqzrc9gdidur&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/jbymn2pe1gomxxsyiczz0/track-7.mp3?rlkey=50ingvj68jylkn9nn9y3ijd9q&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/zjlb3c2xnoeqq22fe63fs/track-8.mp3?rlkey=kc39keb4lgfvu9u28fg2jp3bw&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/2rg3ax1g6ngb76se68d8j/track-9.mp3?rlkey=2v8ecwmkxy3xgglibbuhv5wu4&dl=1",
  },
  2: { // Sacral Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/cm5gr1iydatdm5uf1cfj3/2.track1-PAD1.mp3?rlkey=8v78irib7e6wsdye8j3h1fr50&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/wq28di6plguknroya4rr8/2.track2-PAD2.mp3?rlkey=qkaeuvh7yapuajkjmacayw3c0&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/ovu6u04iri1hpb2jls2qz/2.track3-PAD3.mp3?rlkey=4sfox5gw0b30cuokl0rktaj6b&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/ssmt302lksgao7uns2xh2/2.track4-starsparkle.mp3?rlkey=sfd3ildkowytsx7557f6gpxc9&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/t4hm24qle7g23g7c0dshr/2.track5-arp1.mp3?rlkey=x15pbh29yew7ktdocdr0r6rlh&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/bg77jc7oytdq5ukq0chmx/2.track6-arp2.mp3?rlkey=qzgykxcvsy93tkbp1701rnvwu&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/sl86g12246t2z30z59p27/2.track7-basspad.mp3?rlkey=he9dca0we8qgo55s74l936qgu&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/bkjocfqcbff3k6024nuce/2.track8-river-birds.mp3?rlkey=hauqvh0mw74nxl45v1i30kwje&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/nnxtsap9tetsf5nfnmzzu/2.track9-mockingbirds-LA.mp3?rlkey=z97cn1hpj166cywiezm7outcx&dl=1",
  },
  3: { // Solar Plexus Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/zr08irlxr9wvihunn0xd3/3.track1-PAD1.mp3?rlkey=0btb7wegdqejzfil6fv6h0r4j&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/57dwvj0skm4kn4yrsyy68/3.track2-PAD2.mp3?rlkey=xwn3olj6jgfk8mp1ikh2ntga2&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/gewcjv36n5r943all7m6e/3.track3-PAD3.mp3?rlkey=f6rxsxu8r68bmihb1zh2kcmkj&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/beanar7yze2j0x9w560ll/3.track4-arp2.mp3?rlkey=42v3wgi385b63qjiu323gf7q2&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/c8eabqo4x7dweun4nj5tm/3.track5-arp1.mp3?rlkey=lyzpj649828nye7vavzvxrk1h&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/f4nkkap6apfwwdxn9wkqt/3.track6-basspad.mp3?rlkey=efzyfqi7fylq0woksb5fq1ap5&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/4ofk4628k2kfmtyxeii2i/3.track7-grillos.mp3?rlkey=2bjb8dvvcsgp9zyzm4sk6y3f7&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/onw7ujt4ixxkb46607quw/3.track8-birds.mp3?rlkey=gelq6llo6vq6sys3mhoo8lisb&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/0nc4n3ojw2c6ch2op0r3h/3.track9-nature-creek.mp3?rlkey=crtpgdd04474ar1agz4yu5fc4&dl=1",
  },
  4: { // Heart Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/f0m3p7bd613mt4jb3r7kd/4.track1-pad1.mp3?rlkey=59a7gap3lujh3ytfmf3wq89j3&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/sfsnuevp65eerjm5d2j9i/4.track2-pad2.mp3?rlkey=hjbfmshbcxp9oupu5koh355vj&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/agej5cawq398ufjd6udsq/4.track3-pad-3.mp3?rlkey=mfaop8fpzapv5khk55w4csuou&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/fx1ycsrs4zf3jjx8ijq3y/4.track4-pad4.mp3?rlkey=17bvz9wf0t56rumjv197acbhp&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/envzqcvp5vfhelin37rkh/4.track5-pad5.mp3?rlkey=ucsaj3o9dpgxpqaxa287l6lla&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/75924ycm6xnhr8707y7dz/4.track6-arp.mp3?rlkey=56dg2niznlvkdsxxpuibx53q8&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/c9trhurhaxb86ijpnr19k/4.track7-basspad.mp3?rlkey=cfikzhwexe6snmjwwqrd1icmp&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/ljocxmnvy3lkfus03q2xp/4.track8-ocean.mp3?rlkey=8c6zxw5r8aur0y258xgk4mjdl&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/yeb96w79jdhlsnvciljlg/4.track9-birds.mp3?rlkey=b4dl350f6st9z4h4z34pemlxc&dl=1",
  },
  5: { // Throat Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/xypo9ypgoe7ywf24eir7q/5.track1-pad1.mp3?rlkey=egtdsxq6jf0h0ha9lgu0imup7&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/vi7e1qyxzceheb622juab/5.track2-tuvan-pad.mp3?rlkey=mzrhsh6557j46am538p6ck3v1&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/pejntvvdbvc7yke6cml62/5.track3-vocal-pad.mp3?rlkey=euk301bmkcxyraaqj1a4fbp1x&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/gtofldn0veb8yie89ywrt/5.track4-sparkles.mp3?rlkey=urfokcdxl3luwmf2tj3mpp6ul&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/evobgeq9fcsq9bhsjkjau/5.track5-soft-arp.mp3?rlkey=berq9f91roiqu7o2znl1o23ob&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/m9t2fulwjspskjxw270f0/5.track6-basspad.mp3?rlkey=m0csymw6bptkuzw0w3xy4wwt1&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/1bprg3b9854cwszpnofsi/5.track7-birdsong.mp3?rlkey=y6ay8fmgpgg12asqu20wz0nmm&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/r58cvajp44kzxkn5a7kwv/5.track8-frog-hog.mp3?rlkey=7ewtsk5y3ljz3v3qaoogop315&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/jkj5dq85druiyz5rvz8pu/5.track9-zamzamsafsaf.mp3?rlkey=icmk75mebxzly9qfec52kzlcs&dl=1",
  },
  6: { // Third Eye Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/jnrf561mlwu8xhw28txst/6.track-1-pad1.mp3?rlkey=cqe8zywsvybyqtj4kn2f1ifvl&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/omroc0f1y8tps9qp2pf5q/6.track-2-pad2.mp3?rlkey=vm1ql089mo9cb25oao1csocoi&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/y4hpn7rbxezcpcrggxmpl/6.track-3-pad3.mp3?rlkey=jxxoeqk8e0lnmdr1793vyonl8&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/ttgfrj1h1bf88jrhdty8c/6.track-4-arp-1.mp3?rlkey=7kwgq6we6dr6h383mgtxs9zv6&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/mugg3ip5396rl2t5k7xak/6.track-5-arp-2.mp3?rlkey=3o95183feyppxked4c6weomel&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/4as6onnv7iarnsvmjllnl/6.track-6-basspad.mp3?rlkey=fpnay27z021x3nell5qyp4kmw&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/x1q1aau8w1l4n3bcb65pv/6.track-7-heartpulse.mp3?rlkey=h6kl0w3biid8m0cjfrz80fpq3&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/z027sqf96lth5zkicb40v/6.track-8-grillos.mp3?rlkey=k8ckti5aa1yefdt929765x8w4&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/t2opxh1podifizfq7ycql/6.track-9-birdies.mp3?rlkey=8d8sphlpzjlw5vvu8m19q4npv&dl=1",
  },
  7: { // Crown Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/o9rfjd01jqsxsyhtmdvk5/7-track-1.mp3?rlkey=nc2ekervyhtzrvdl3q7730n3t&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/0sr2vm42uqotlvk979rd8/7-track-2.mp3?rlkey=ah9mq50owkc0eiilvt600qzax&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/gbhblzur7kiyqi5y8g0fm/7-track-3.mp3?rlkey=duej639e0z3i2z2k4x1rvrild&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/r87i8mwqwmuiwqszvz2ph/7-track-4.mp3?rlkey=bdm1fnrj937lmc7xk9ximwh0g&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/z6sery5l32oql6zbnmfuc/7-track-5.mp3?rlkey=yvf71oylyk97p5h1o7r1jf756&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/98xevfu9y0oik9d391npk/7-track-6.mp3?rlkey=tt8e0jpokczhhu65s1bt2f9oi&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/r8j0beko7etd5u4z2ud71/7-track-7.mp3?rlkey=ad6ot5q57ybf59s5p03qt518t&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/bahzwywbvopxf8io2jt14/7-track-8.mp3?rlkey=mrdfma2buk01pw6kk5k8rqfx1&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/n9vtegqdtyd98cv111yjb/7-track-9.mp3?rlkey=uf3tvoiu9d2jn04574jh93i48&dl=1",
  },
};

// Set to true to use external URLs from audioConfig above
// Set to false to use local files from /public/audio/
export const USE_EXTERNAL_URLS = true;

// Helper function to get audio URL based on configuration
export function getAudioUrl(chakraId: number, trackId: number): string {
  if (USE_EXTERNAL_URLS) {
    return audioConfig[chakraId]?.[trackId] || '';
  } else {
    // Local files format: /audio/{chakraId}/track-{trackId}.mp3
    return `/audio/${chakraId}/track-${trackId}.mp3`;
  }
}
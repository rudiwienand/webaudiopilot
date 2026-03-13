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
    1: "https://dl.dropboxusercontent.com/scl/fi/tbp9jzndgq9fpwcthcw9t/track-1-Chakra-1mastered.mp3?rlkey=4zy2we9u11jupchc3f0giml4i&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/f4cttqbd7hh7blq5yfl9x/track-2-Chakra-1mastered.mp3?rlkey=4v6p2gjjiaypj2zn7d842i3zp&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/7ogdmpi1m8u0e9fgf2res/track-3-Chakra-1mastered.mp3?rlkey=9fsy67qgfjyb1cjvg59ahtc19&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/q6el2ndo0xi6cb4bssu5k/track-4-Chakra-1mastered.mp3?rlkey=xok328yhm7rsdq5j6j8bgy0cj&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/23ozaghwz2c88zo7x8gry/track-5-Chakra-1mastered.mp3?rlkey=wjye9gg7obzrgui59gxfjmi5i&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/dyk5x0ah68g8688m1v3oc/track-6-Chakra-1mastered.mp3?rlkey=1subpprkw9jo3x4jcxbo2l3sq&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/99uydk94ol5ziksgrsbv8/track-7-Chakra-1mastered.mp3?rlkey=l94mhsv2clezn5jubxnwx4evv&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/69rqf1q6pltrtphyx44lc/track-8-Chakra-1mastered.mp3?rlkey=as7e6e47jpcg4eo9i41q8bdb3&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/4bt9p1jhcc11x1qq7dnck/track-9-Chakra-1mastered.mp3?rlkey=pyl3ym75yn7kygt6n9jt85gzt&dl=1",
  },
  2: { // Sacral Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/qqtn343q5tgk2cg0fyfwa/Track-1-Chakra-2mastered.mp3?rlkey=77u5qanhggz2udwuj2ehcrl7v&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/hselwoketkk7161szoso6/Track-2-Chakra-2mastered.mp3?rlkey=yl9e9z2h3ixzomlxdoyni29u1&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/0g2o638j0h0u3ic18jz2l/Track-3-Chakra-2mastered.mp3?rlkey=nc37xmkyx6ly3k8d2n8wkgvit&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/p97kmh1bk3flq8ni8e5y9/Track-4-Chakra-2mastered.mp3?rlkey=5c485o1cvpsee2mydprpdvxvf&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/3p3jd3m63830jkav8zw3b/Track-5-Chakra-2mastered.mp3?rlkey=r7cq059cyo3x9kqhjbd70oqvo&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/pz6zudg35l5ijti3tzglt/Track-6-Chakra-2mastered.mp3?rlkey=lp3o3xtc6zkojtq43gyli4j0p&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/b0stqpi475h18cbk943o1/Track-7-Chakra-2mastered.mp3?rlkey=ue8t7ewk6hpsx7jl9hq5vez84&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/9hitgw17tvny94h9rq1jj/Track-8-Chakra-2mastered.mp3?rlkey=2ybyr573dn5z9po5d0gf8a6su&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/9bdpbkbpjgsoie0kcclgo/Track-9-Chakra-2mastered.mp3?rlkey=4bxlm65jmwvr974wexad4b39r&dl=1",
  },
  3: { // Solar Plexus Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/661ffteu01zb6b8ysa1zh/Track-1-Chakra-3mastered.mp3?rlkey=hw1ifxf9wontkv7c6ae512745&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/14s3rftsaq06wqtvhvy2b/Track-2-Chakra-3mastered.mp3?rlkey=ejbo6dpeo0vkajdy96vi3kqol&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/ah58dq1f6ftcty1r04wsd/Track-3-Chakra-3mastered.mp3?rlkey=jd2pjyzfknzyghewsgzrwtz55&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/lxppgizrfp6d6iib5ykru/Track-4-Chakra-3mastered.mp3?rlkey=t5l09n1ewqiivzqimt8dh21pd&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/pbj6u26qyqqdz49br38s9/Track-5-Chakra-3mastered.mp3?rlkey=8lc0sofete1c52yak2959hnml&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/5f6f7f7xi91f9atmhuufp/Track-6-Chakra-3mastered.mp3?rlkey=qammbdafi5y27nfz2naa5oxsd&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/f26k0v1bsbdta1jinngyf/Track-7-Chakra-3mastered.mp3?rlkey=de9yuya8u9ufdbg7aee299tn0&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/ckwupr8jqj7y4v67kawla/Track-8-Chakra-3mastered.mp3?rlkey=kjbbnxr4ugc3n9wkh8dc4p0ku&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/oi48nladf265ggaxn03fv/Track-9-Chakra-3mastered.mp3?rlkey=2wtmj9dmtb2i6wxwl5chcekuk&dl=1",
  },
  4: { // Heart Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/69skfh5q1wqujpb72ot7z/Track-1-Chakra-4mastered.mp3?rlkey=rl2i0qwmjdkb9k76c8gi9q67t&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/a49izx1n3b6eb4h3pgb5k/Track-2-Chakra-4mastered.mp3?rlkey=yobf7wwt6m7vk2i1at0zcfz19&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/j9dlfxrej7oa86fk8v0gp/Track-3-Chakra-4mastered.mp3?rlkey=dx9iw7b5c94w700h3wrjcr47h&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/3ddffgudjrsl6vgmwetiy/Track-4-Chakra-4mastered.mp3?rlkey=46300kyya3vex9fiiv4qkrf7z&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/mq6nejw1jfdsbe5dase8h/Track-5-Chakra-4mastered.mp3?rlkey=zgfvkae8iqy9exgb9llmv5rvx&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/s5xxix739fzvt7f74hy6g/Track-6-Chakra-4mastered.mp3?rlkey=dhw6p4yoz98q30evoostn4vm6&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/e9el0ruqrr0kq4myo2v4y/Track-7-Chakra-4mastered.mp3?rlkey=4ozaioh79n6gpnmhhn63dcixl&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/eg4b9wy7nuu8dijcfll66/Track-8-Chakra-4mastered.mp3?rlkey=3g3vnia1i55jsst12ubp9e3ok&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/qygc3wqxbynyhysyvufkz/Track-9-Chakra-4mastered.mp3?rlkey=r29uiy50w0uc5ojj41fx4yhnf&dl=1",
  },
  5: { // Throat Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/9syhtdb0k5pyej1l4j3pu/Track-1-Chakra-5mastered.mp3?rlkey=17hp46udmb5viqhr1cbwh73ik&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/ch6u7ctpxtmejqtn7b2xt/Track-2-Chakra-5mastered.mp3?rlkey=3j9zl0s8edhqguerle0sh39ni&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/ckw9ljduje90y981oxy4o/Track-3-Chakra-5mastered.mp3?rlkey=m6eggob6qm9th1yq1dxvp4xxn&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/xhsu60dgouc54849g38wh/Track-4-Chakra-5mastered.mp3?rlkey=7ab2g673fa6z4ilsz9jovn78x&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/c2ufau1e863mc9imi7z3t/Track-5-Chakra-5mastered.mp3?rlkey=04wbysmizfj09ylxmhwxxz0rn&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/zj5n48m3x1krelwxdjo1k/Track-6-Chakra-5mastered.mp3?rlkey=xp4msokqlbur0serc0zjjly5a&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/lgkadbmcnu5dt160q410c/Track-7-Chakra-5mastered.mp3?rlkey=5700f2in0f5pu1cn4732hnqrr&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/bw80zihhixo6lmdl9jrca/Track-8-Chakra-5mastered.mp3?rlkey=m51md4erwc98ba80lmsq7biog&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/dgm49ksqy274cpuxpphe6/Track-9-Chakra-5mastered.mp3?rlkey=77pgqlw3qpeh2tin75dwcxn1p&dl=1",
  },
  6: { // Third Eye Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/ne9n685dwwwjkym622xgr/Track-1-Chakra-6mastered.mp3?rlkey=91556awrttf38tcpjswtozywa&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/jwsqnjkdf9ev31fy3kcls/Track-2-Chakra-6mastered.mp3?rlkey=8n11s1m7xwfzivizs56q2z2dr&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/aoyu58lh748bhidusty5o/Track-3-Chakra-6mastered.mp3?rlkey=lakm1zvrdkxis5lnrurluzbrv&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/tz5gvkrrjhsgsex82bc5i/Track-4-Chakra-6mastered.mp3?rlkey=y93hhrtxjryklbpllfuy6ixh1&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/23gvha9vw4mm705695jj4/Track-5-Chakra-6mastered.mp3?rlkey=2il1qa5ws4jokvbusagczerel&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/g7hesz847cnyzsgd63zng/Track-6-Chakra-6mastered.mp3?rlkey=l1je5npmyvqkpabycahw9j3ix&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/efsgo3y210adox2gnwqnn/Track-7-Chakra-6mastered.mp3?rlkey=78yxb6aa4g1zkbqdrlli8pme8&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/gw4angop1k0tw1lj34ti6/Track-8-Chakra-6mastered.mp3?rlkey=7j26slugrua6zn1t8zpgqhc5w&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/44hq2d5yuco2j87k9sgnc/Track-9-Chakra-6mastered.mp3?rlkey=56her7zg39hqkhp4qrq86gcp8&dl=1",
  },
  7: { // Crown Chakra
    1: "https://dl.dropboxusercontent.com/scl/fi/df79fe2lgn3eir0dlwde3/Track-1-Chakra-7mastered.mp3?rlkey=buwyb7r1jeg8tufbl2la1yd7d&dl=1",
    2: "https://dl.dropboxusercontent.com/scl/fi/aif39lsxugqnqtaf355px/Track-2-Chakra-7mastered.mp3?rlkey=euw6om0qdpd2izbpkcacezwub&dl=1",
    3: "https://dl.dropboxusercontent.com/scl/fi/aetoio7d2r21n3vwd3twk/Track-3-Chakra-7mastered.mp3?rlkey=wotdrtu9lylshqcqqxmsfb71v&dl=1",
    4: "https://dl.dropboxusercontent.com/scl/fi/v2icimed9gwqo284lnghf/Track-4-Chakra-7mastered.mp3?rlkey=wpr6o81tk2maqqnv9wb8c6hqb&dl=1",
    5: "https://dl.dropboxusercontent.com/scl/fi/33z8rhvwsxwr3nxeqdvvc/Track-5-Chakra-7mastered.mp3?rlkey=zfcre5ql5bgbvmu8ylq1d968q&dl=1",
    6: "https://dl.dropboxusercontent.com/scl/fi/zj3nyuj2qa5ilihws9dqv/Track-6-Chakra-7mastered.mp3?rlkey=gw0g447ercyej8kin5l45bsvt&dl=1",
    7: "https://dl.dropboxusercontent.com/scl/fi/9tze5pxjumoydizvbl348/Track-7-Chakra-7mastered.mp3?rlkey=wqcxks5kps2fju5gdqfmo4111&dl=1",
    8: "https://dl.dropboxusercontent.com/scl/fi/veyv20k0o24dgo7akpzze/Track-8-Chakra-7mastered.mp3?rlkey=i7uugmrkycmmxtcwtopogxlkp&dl=1",
    9: "https://dl.dropboxusercontent.com/scl/fi/mft9ken41tbibn5vpte0o/Track-9-Chakra-7mastered.mp3?rlkey=zmn7so6sp48b10huefqm85g4z&dl=1",
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
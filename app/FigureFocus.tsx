'use client';

import { useEffect, useState } from 'react';

type Trace={
  name:'Dete'|'Almöhi';
  heading:string;
  scene:string;
  consequence:string;
};

type FocusCase={
  id:string;
  chapter:string;
  short:string;
  title:string;
  entrance:string;
  dete:Trace;
  almoehi:Trace;
  leftPole:string;
  rightPole:string;
  weighing:string;
  reasonLabel:string;
  starter:string;
  probe:string;
  options:[string,string,string];
  optionReplies:[string,string,string];
  feedback:[string,string,string];
};

type CaseWork={opened:string[];weight:number;reason:string;probe:number|null};
type FocusState=Record<string,CaseWork>;

const cases:FocusCase[]=[
  {
    id:'alp',chapter:'Erster Teil · Kap. 1',short:'Die Übergabe',
    title:'Dete lässt Heidi beim Grossvater zurück – aber wem verschafft sie damit Handlungsspielraum?',
    entrance:'Am selben Nachmittag treffen Detes Erwerbszwang, Heidis bisherige Abhängigkeit und der Rückzug des Almöhis aufeinander. Öffne beide Handlungen; entscheide erst danach, ob «Abgabe» die Szene genau genug beschreibt.',
    dete:{name:'Dete',heading:'Sie bringt Heidi hinauf und reist wieder ab.',scene:'Dete hat Heidi nach dem Tod der Grossmutter mehrere Jahre versorgt. Nun erhält sie eine gute Stelle in Frankfurt und erklärt dem Almöhi, dass er als nächster Verwandter für das Kind sorgen müsse.',consequence:'Heidi bekommt einen festen Ort; zugleich trifft Dete die Trennung und den neuen Lebensort ohne Heidis Mitentscheidung.'},
    almoehi:{name:'Almöhi',heading:'Er widerspricht Dete – und behält Heidi bei sich.',scene:'Der Almöhi reagiert schroff auf Detes Erklärungen. Trotzdem richtet er Heidi noch am ersten Tag einen Schlafplatz her, bereitet Essen und passt seine Hütte an das Kind an.',consequence:'Sein praktisches Handeln schafft Schutz. Seine Absonderung entscheidet aber ebenfalls darüber, welche Menschen, Schule und Gemeinschaft Heidi erreichen.'},
    leftPole:'Detes Fortgang ist vor allem Selbstentlastung',rightPole:'Detes Fortgang eröffnet Heidi einen eigenen Ort',
    weighing:'Welche der beiden Folgen erklärt Detes Weggang besser: dass Heidi ungefragt zurückbleibt oder dass sie erstmals nicht zwischen Detes Arbeitsstellen mitziehen muss?',
    reasonLabel:'Entscheide, ob der feste Ort die ungefragte Trennung aufwiegt',
    starter:'Detes Weggang wiegt für Heidi vor allem als …; die Handlung des Almöhis verändert daran …',
    probe:'Stell dir vor, Dete hätte ihre Frankfurter Stelle ausgeschlagen und Heidi weiter von Haushalt zu Haushalt mitgenommen. Welcher Befund würde dein Urteil am stärksten verändern?',
    options:['Heidi wäre bei ihrer vertrauten Bezugsperson geblieben.','Heidi wäre weiterhin von Detes wechselnden Arbeitsorten abhängig.','Der Almöhi hätte keine Verantwortung übernehmen müssen.'],
    optionReplies:['Damit erhält die abrupte Trennung besonderes Gewicht. Prüfe nun, ob die vertraute Person zugleich verlässliche Zeit für Heidi hatte.','Damit wird Detes Stelle nicht nur zum privaten Vorteil. Benenne dennoch, warum eine Verbesserung der Versorgung keine Zustimmung Heidis ersetzt.','Damit rückt die verweigerte Familienpflicht des Almöhis vor der Ankunft in den Blick. Trenne sie von seiner Fürsorge nach Heidis Ankunft.'],
    feedback:['Du gewichtest die ungefragte Trennung stärker. Nenne im Urteil die eine Handlung des Almöhis, die verhindert, dass Heidi bloss «abgegeben» bleibt.','Dein Regler hält Nutzen und Verlust zusammen. Entscheide im Satz, welches Detail den kleinen Ausschlag gibt.','Du gewichtest Heidis neuen festen Ort stärker. Lass Detes fehlende Vorbereitung trotzdem ausdrücklich im Urteil stehen.']
  },
  {
    id:'frankfurt',chapter:'Erster Teil · Kap. 5',short:'Der Frankfurter Vorschlag',
    title:'Als Dete Heidi nach Frankfurt holt, verspricht sie eine Chance – für wen ist es tatsächlich eine?',
    entrance:'Dete nennt das Haus Sesemann eine aussergewöhnliche Möglichkeit. Der Almöhi lehnt den Plan ab, lässt Dete und Heidi am Ende aber ziehen. Verfolge, wie beide Erwachsenen über Zukunft sprechen, während Heidi den Preis noch nicht kennt.',
    dete:{name:'Dete',heading:'Sie beschreibt Frankfurt als Aufstieg und Gelegenheit.',scene:'Dete berichtet von einem reichen Haus, einem gelähmten Mädchen und Unterricht für Heidi. Sie lockt Heidi zudem mit der Aussicht, später Geschenke für die blinde Grossmutter mitbringen zu können.',consequence:'Bildung und materielle Möglichkeiten werden erreichbar; Heidis Zustimmung entsteht jedoch auf einer unvollständigen Vorstellung von Entfernung und Dauer.'},
    almoehi:{name:'Almöhi',heading:'Er warnt nicht, sondern weist Dete die Entscheidung zu.',scene:'Der Almöhi will Heidi nicht fortgeben und reagiert zornig. Als Dete auf ihrem Plan besteht, erklärt er sinngemäss, sie solle sehen, dass sie nie mehr vor seine Augen komme.',consequence:'Er erkennt die Gefahr der Trennung, übersetzt seine Sorge aber nicht in eine Erklärung, mit der Heidi selbst urteilen könnte.'},
    leftPole:'Frankfurt dient vor allem Detes Entlastung',rightPole:'Frankfurt dient vor allem Heidis Zukunft',
    weighing:'Gewichte nicht das spätere Ende, sondern Detes Entscheidung in diesem Moment: Wie viel zählt die reale Bildungschance, wenn Heidi weder Dauer noch Regeln des Hauses kennt?',
    reasonLabel:'Halte Detes Bildungsversprechen gegen Heidis fehlendes Wissen',
    starter:'Die Frankfurter Stelle ist für Heidi eine Chance auf …, doch Detes Art, sie dafür zu gewinnen, …',
    probe:'Welches fehlende Wissen macht Heidis freudiges Mitgehen am wenigsten zu einer informierten Zustimmung?',
    options:['Sie weiss nicht, wie lange sie fortbleiben soll.','Sie kennt Fräulein Rottenmeiers Regeln noch nicht.','Sie kann die Entfernung zur Alp nicht einschätzen.'],
    optionReplies:['Die offene Dauer betrifft Heidis Bindung an den Grossvater unmittelbar. Verbinde sie mit Detes Versprechen, man könne zurückkehren, wenn es einem nicht gefalle.','Die unbekannten Regeln erklären den späteren Konflikt im Haus. Zeige, warum eine unbekannte Belastung Detes Bildungsargument begrenzt.','Die Entfernung verändert das Gewicht des Abschieds. Erkläre, warum «später zurück» für ein Kind ohne räumliche Vorstellung kein klarer Plan ist.'],
    feedback:['Du liest Detes Angebot vor allem als Entlastung. Räume der Schule und Klaras Gesellschaft trotzdem einen konkreten möglichen Nutzen ein.','Du hältst Chance und Täuschung gleichzeitig fest. Benenne, welches fehlende Wissen für dich entscheidend ist.','Du gewichtest die Zukunftschance stärker. Begrenze das Urteil mit der Frage, ob eine gute Folge Detes Informationsvorsprung rechtfertigt.']
  },
  {
    id:'lernen',chapter:'Erster Teil · Kap. 4 und Zweiter Teil · Kap. 4',short:'Schule und Lernen',
    title:'Heidi lernt auf der Alp aufmerksam zu sehen – warum genügt das dem Almöhi später selbst nicht mehr?',
    entrance:'Der Almöhi vermittelt Wetter, Tiere und Arbeit im gemeinsamen Alltag, hält Heidi aber zunächst von der Schule fern. Später zieht er im Winter ins Dörfli. Untersuche nicht «Natur oder Bildung», sondern den Wandel seiner eigenen Entscheidung.',
    dete:{name:'Dete',heading:'Sie verbindet Frankfurt mit Unterricht und gesellschaftlicher Teilhabe.',scene:'Dete führt als Vorteil an, dass Heidi im Haus Sesemann etwas lernen könne. Tatsächlich erhält Heidi dort Unterricht und entdeckt durch die Grossmama einen persönlichen Grund zu lesen.',consequence:'Detes Plan öffnet formale Bildung; dass Heidi dort krank wird, zeigt zugleich, dass Bildung ohne passende Lebensbedingungen nicht automatisch fürsorglich ist.'},
    almoehi:{name:'Almöhi',heading:'Er lehrt im Alltag – und revidiert später die Schulverweigerung.',scene:'Auf der Alp erklärt und zeigt der Grossvater, statt einen Stundenplan vorzugeben. Nach Heidis Rückkehr nimmt er die Forderung nach Schule und Gemeinschaft ernster und bezieht für den Winter das Haus im Dörfli.',consequence:'Er bewahrt die Erfahrungsnähe seines Lernens, ergänzt sie aber um regelmässige Schule und Kontakte, die seine Hütte allein nicht bieten kann.'},
    leftPole:'Detes Bildungsweg korrigiert den Almöhi',rightPole:'Der Almöhi findet selbst eine passendere Verbindung',
    weighing:'Ist der Umzug ins Dörfli ein spätes Eingeständnis, dass Dete mit der Schule recht hatte, oder eine neue Lösung, die gerade aus dem Scheitern Frankfurts lernt?',
    reasonLabel:'Zeige am Dörfli-Winter, was der Almöhi übernimmt und was er verändert',
    starter:'Der Winter im Dörfli übernimmt von Detes Plan …; anders als Frankfurt bewahrt er für Heidi …',
    probe:'Welche Veränderung trennt den Dörfli-Winter am deutlichsten von Heidis Unterricht im Haus Sesemann?',
    options:['Heidi bleibt in der Nähe des Grossvaters und der Alp.','Sie besucht nun gemeinsam mit Peter die Schule.','Der Almöhi verlässt für einen Teil des Jahres seine Absonderung.'],
    optionReplies:['Damit verbindest du Bildung und Bindung, statt sie gegeneinander auszuspielen. Zeige, warum genau diese Nähe in Frankfurt fehlte.','Der gemeinsame Schulweg macht Bildung auch zu einer sozialen Erfahrung. Vergleiche Peters Rolle mit dem isolierten Unterricht beim Kandidaten.','Damit wird Bildung zur Veränderung des Erwachsenen, nicht nur des Kindes. Erkläre, welche Pflicht der Almöhi jetzt anerkennt.'],
    feedback:['Du siehst im Dörfli vor allem eine Korrektur durch Detes Bildungsargument. Zeige, welche Frankfurter Erfahrung trotzdem nicht wiederholt wird.','Du erkennst eine Verbindung beider Modelle. Formuliere, was der Almöhi übernimmt und was er bewusst anders einrichtet.','Du betonst den eigenen Lernprozess des Almöhis. Nenne die frühere Schulverweigerung, an der diese Veränderung sichtbar wird.']
  },
  {
    id:'mitsprache',chapter:'Erster Teil · Kap. 5 und 14',short:'Heidis Stimme',
    title:'Beide wollen Heidi schützen – wann hören Dete und der Almöhi tatsächlich auf das Kind?',
    entrance:'Dete organisiert den Weg nach Frankfurt, der Almöhi später die Rückkehr auf die Alp. In beiden Fällen handeln Erwachsene für Heidi. Entscheidend ist, ob Heidis Wünsche nur zum Ergebnis passen oder den Entscheid wirklich mitformen.',
    dete:{name:'Dete',heading:'Sie nutzt Heidis Hilfswunsch, um Zustimmung zu gewinnen.',scene:'Heidi möchte der blinden Grossmutter helfen. Dete verbindet diesen Wunsch mit der Reise nach Frankfurt und stellt eine Rückkehr in Aussicht, ohne die Bedingungen des Aufenthalts offenzulegen.',consequence:'Heidis eigener Wunsch kommt vor, wird aber in Detes bereits gefassten Plan eingespannt.'},
    almoehi:{name:'Almöhi',heading:'Er erkennt an Heidis Zustand, dass sie zurückmuss.',scene:'Nach der Heimkehr nimmt der Almöhi Heidis Freude und Gesundung ernst. Später verändert er auch seinen Winterplan und zieht näher an Dorf und Schule.',consequence:'Er reagiert auf Heidis Bedürfnisse, fragt sie bei den grundlegenden Ortsentscheidungen aber ebenfalls nicht in heutiger Form um Zustimmung.'},
    leftPole:'Dete instrumentalisiert Heidis Wunsch',rightPole:'Der Almöhi deutet Heidis Wunsch stellvertretend',
    weighing:'Was ist für Heidis Mitsprache gefährlicher: wenn ein ausgesprochener Wunsch für einen fremden Plan benutzt wird oder wenn ein Erwachsener ihre Bedürfnisse richtig erkennt, aber allein entscheidet?',
    reasonLabel:'Unterscheide zwischen Heidis genanntem Wunsch und einer Entscheidung mit Heidi',
    starter:'Heidis Satz über die Grossmutter wird bei Dete zu …; der Almöhi behandelt Heidis sichtbare Reaktion dagegen als …',
    probe:'Woran würdest du im Roman am ehesten erkennen, dass Heidi an einer Entscheidung wirklich beteiligt war?',
    options:['Sie kennt vorher Dauer, Ort und mögliche Folgen.','Sie darf einen eigenen Grund nennen, der den Plan verändert.','Sie kann nach einer Probezeit ohne Drohung zurückkehren.'],
    optionReplies:['Damit verlangst du nicht bloss ein «Ja», sondern verständliche Voraussetzungen. Wende genau diese drei Informationen auf Detes Reiseplan an.','Damit misst du Mitsprache an Wirkung. Zeige, welche Entscheidung des Almöhis durch Heidis Bedürfnis tatsächlich verändert wird.','Damit wird Zustimmung widerrufbar. Prüfe, ob Detes Rückkehrversprechen und die spätere Wirklichkeit zusammenpassen.'],
    feedback:['Du hältst Detes Umgang mit Heidis Wunsch für schwerwiegender. Unterscheide im Urteil zwischen einem genannten Wunsch und einer Entscheidung über die Reise.','Du siehst bei beiden verschiedene Formen stellvertretender Entscheidung. Lege fest, welches erkennbare Zeichen aus dem Roman echte Mitsprache näherbringt.','Du hältst die richtige Deutung durch den Almöhi für das grössere Problem. Erkläre, warum ein gutes Ergebnis das Alleinentscheiden nicht aufhebt.']
  },
  {
    id:'gemeinschaft',chapter:'Erster Teil · Kap. 1–4 und Zweiter Teil · Kap. 4',short:'Nähe zur Gemeinschaft',
    title:'Dete bewegt sich zwischen Haushalten, der Almöhi zieht sich zurück – wer verschafft Heidi tragfähigere Beziehungen?',
    entrance:'Detes Arbeitswelt schafft Kontakte, aber wenig Beständigkeit. Die Alp schafft intensive Bindungen, begrenzt jedoch Schule und Dorfleben. Prüfe, welche Art von Beziehung Heidi bei beiden gewinnt und welche sie verliert.',
    dete:{name:'Dete',heading:'Ihre Wege verbinden Heidi mit neuen Haushalten.',scene:'Durch Dete gelangt Heidi zunächst zur Grossmutter und später nach Frankfurt zu Clara, Herr Sesemann und der Grossmama. Dete selbst kann wegen ihrer Arbeit jedoch keine dauerhafte gemeinsame Lebensform anbieten.',consequence:'Detes Mobilität erweitert Heidis Beziehungswelt, setzt sie aber wiederholt Trennungen und Entscheidungen anderer Haushalte aus.'},
    almoehi:{name:'Almöhi',heading:'Seine Hütte ermöglicht Nähe und begrenzt den Kreis.',scene:'Beim Almöhi entstehen verlässliche Alltagsbeziehungen zu ihm, Peter, den Geissen und Peters Grossmutter. Sein Streit mit dem Dorf hält Heidi zunächst von Schule und grösserer Gemeinschaft fern.',consequence:'Die wenigen Beziehungen werden tragfähig; der Preis ist, dass Heidis Zugang zu Gleichaltrigen und Institutionen vom Rückzug des Grossvaters abhängt.'},
    leftPole:'Viele Verbindungen trotz Wechseln',rightPole:'Wenige, dafür beständige Bindungen',
    weighing:'Welche Beziehung trägt Heidi durch eine Krise tatsächlich – und welche neue Beziehung wäre ohne Detes Ortswechsel nie entstanden?',
    reasonLabel:'Verbinde eine Frankfurter Beziehung mit einer tragenden Bindung auf der Alp',
    starter:'Durch Dete entsteht die Beziehung zu …, die Heidi hilft, als …; beim Almöhi trägt besonders …, weil …',
    probe:'Welche Figur widerlegt am stärksten die einfache Gleichung «Frankfurt ist fremd, die Alp ist Heimat»?',
    options:['Clara, weil aus der zugeteilten Gesellschaft Freundschaft wird.','Die Grossmama, weil sie Heidi zuhört und das Lesen anders eröffnet.','Herr Sesemann, weil er Heidis Not schliesslich ernst nimmt.'],
    optionReplies:['Claras Freundschaft macht Frankfurt zu mehr als einem Zwangsort. Erkläre zugleich, warum Freundschaft Heidis Heimweh nicht beseitigt.','Die Grossmama schafft in der Fremde eine passende Lernbeziehung. Vergleiche ihre Aufmerksamkeit mit der Alltagsnähe des Almöhis.','Herr Sesemanns Entscheidung ermöglicht die Rückkehr. Zeige, warum seine späte Reaktion die vorherige Blindheit des Hauses nicht ungeschehen macht.'],
    feedback:['Du gewichtest Detes erweiterte Beziehungswelt stärker. Nenne die Frankfurter Person, die diese Möglichkeit wirklich in Fürsorge verwandelt.','Du hältst Erweiterung und Beständigkeit zusammen. Zeige an einer Figur, wie eine neue Beziehung zur tragfähigen Bindung wird.','Du gewichtest die beständigen Alp-Beziehungen stärker. Nenne die Beziehung, die Heidi ohne Detes Mobilität fehlen würde.']
  },
  {
    id:'veraenderung',chapter:'Zweiter Teil · Kap. 4–8',short:'Wer verändert sich?',
    title:'Der Almöhi übernimmt neue Pflichten; bleibt Dete wirklich die unveränderte Gegenfigur?',
    entrance:'Am Ende ist der Wandel des Almöhis sichtbar: Dorf, Schule, Versöhnung und Vorsorge. Dete tritt seltener auf. Entscheide, was der Roman tatsächlich über Veränderung zeigt – und was wegen der ungleichen Erzählzeit offenbleibt.',
    dete:{name:'Dete',heading:'Ihre späteren Handlungsmöglichkeiten bleiben am Rand.',scene:'Nach Heidis Rückkehr steht Dete nicht mehr im Zentrum der Handlung. Der Roman zeigt weder eine ausführliche Selbstprüfung noch eine neue gemeinsame Entscheidung mit Heidi.',consequence:'Man kann ihre frühere Ambivalenz beurteilen; aus dem Schweigen des Romans lässt sich aber nicht sicher beweisen, dass sie innerlich unverändert bleibt.'},
    almoehi:{name:'Almöhi',heading:'Sein Wandel wird in mehreren Handlungen sichtbar.',scene:'Er sucht wieder die Kirche auf, versöhnt sich mit dem Pfarrer, zieht im Winter ins Dörfli und trifft Vorsorge für Heidis Zukunft bei den Sesemanns.',consequence:'Fürsorge bedeutet nun nicht mehr nur Schutz in der Hütte, sondern auch Gemeinschaft, Schule und eine Zukunft über sein eigenes Leben hinaus.'},
    leftPole:'Detes Ausbleiben zeigt fehlende Verantwortung',rightPole:'Der Roman gibt Dete kaum Raum für sichtbaren Wandel',
    weighing:'Darf Detes fehlende Rückkehr als Charakterurteil gelten, wenn der Roman ihren weiteren Weg kaum erzählt, während er den Almöhi bei jeder Veränderung begleitet?',
    reasonLabel:'Trenne den erzählten Wandel des Almöhis vom Schweigen über Detes weiteren Weg',
    starter:'Beim Almöhi belegt die Handlung … seinen Wandel; über Dete lässt sich dagegen nur sicher sagen, dass …',
    probe:'Welche Handlung beweist am stärksten, dass der Almöhi seine Fürsorge über die private Bindung an Heidi hinaus erweitert?',
    options:['Er besucht wieder die Kirche und spricht mit dem Pfarrer.','Er zieht im Winter wegen Schule und Gemeinschaft ins Dörfli.','Er bespricht mit Herr Sesemann Heidis Versorgung nach seinem Tod.'],
    optionReplies:['Die Versöhnung beendet einen Teil seines sozialen Rückzugs. Erkläre, wie das auch Heidis Stellung im Dorf verändern kann.','Der Umzug kostet ihn die bevorzugte Absonderung. Zeige, welche konkrete Möglichkeit Heidi dadurch erhält.','Die Vorsorge reicht über seine eigene Lebenszeit hinaus. Verbinde sie mit der Unsicherheit, die Detes frühere Übergaben erzeugt haben.'],
    feedback:['Du deutest Detes Abwesenheit als fehlende Verantwortung. Kennzeichne im Urteil, dass dies eine Folgerung aus ihrem Ausbleiben und keine erzählte Selbstäusserung ist.','Du unterscheidest zwischen Figurenurteil und Erzählverteilung. Formuliere, was bei Dete sicher beobachtbar bleibt.','Du begrenzt das Urteil über Dete wegen ihrer knappen Erzählzeit. Stelle dem eine einzelne, klar belegte Veränderung des Almöhis gegenüber.']
  }
];

const blank=():CaseWork=>({opened:[],weight:50,reason:'',probe:null});
const storageKey='denkraum-figurenfokus-v2';

export default function FigureFocus({onClose}:{onClose:()=>void}){
  const [activeId,setActiveId]=useState(cases[0].id);
  const [works,setWorks]=useState<FocusState>(()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}});
  const active=cases.find(item=>item.id===activeId)!;
  const work={...blank(),...(works[activeId]||{})};
  const openedDete=work.opened.includes('dete');
  const openedAlmoehi=work.opened.includes('almoehi');
  const bothOpen=openedDete&&openedAlmoehi;
  const complete=cases.filter(item=>{const entry=works[item.id];return entry?.opened.includes('dete')&&entry.opened.includes('almoehi')&&entry.probe!==null&&entry.reason.trim().length>0}).length;
  const feedbackIndex=work.weight<40?0:work.weight>60?2:1;
  const selectedReply=work.probe===null?'':active.optionReplies[work.probe];
  const verdictReady=bothOpen&&work.probe!==null&&work.reason.trim().length>0;
  const excerpt=work.reason.trim().replace(/\s+/g,' ').slice(0,180);

  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(works))}catch{}},[works]);
  const update=(patch:Partial<CaseWork>)=>setWorks(current=>({...current,[activeId]:{...(current[activeId]||blank()),...patch}}));
  const toggleTrace=(side:'dete'|'almoehi')=>update({opened:work.opened.includes(side)?work.opened.filter(item=>item!==side):[...work.opened,side]});
  const progress=[bothOpen,work.reason.trim().length>0,work.probe!==null];

  return <div className="modal-backdrop figure-focus-backdrop" role="dialog" aria-modal="true" aria-label="Figurenfokus Dete und Almöhi">
    <section className="figure-focus-shell">
      <header className="figure-focus-head"><button onClick={onClose}>← Zurück zum Denkraum</button><div><small>Figurenfokus · Fallatelier</small><b>{complete}/6 Urteile aufgebaut</b></div><button className="focus-close" onClick={onClose} aria-label="Schliessen">×</button></header>
      <div className="figure-focus-intro"><div><span>Dete ↔ Almöhi</span><h2>Nicht vergleichen.<br/><em>Entscheidungen untersuchen.</em></h2></div><p>Hier stehen keine fertigen Eigenschaften. Du öffnest zwei Handlungen aus derselben Konfliktlage, gewichtest ihre Folgen für Heidi und setzt dein Urteil einer konkreten Gegenprobe aus.</p></div>

      <nav className="case-ribbon" aria-label="Konflikt auswählen">{cases.map((item,index)=>{const saved=works[item.id];const done=saved?.probe!==null&&saved?.reason.trim().length>0&&saved?.opened.length===2;return <button key={item.id} className={activeId===item.id?'active':done?'done':''} aria-pressed={activeId===item.id} onClick={()=>setActiveId(item.id)}><i>{done?'✓':String(index+1).padStart(2,'0')}</i><span><small>{item.chapter}</small>{item.short}</span></button>})}</nav>

      <main className="focus-case">
        <header className="case-question"><div><small>{active.chapter} · {active.short}</small><h3>{active.title}</h3></div><p>{active.entrance}</p></header>

        <section className="trace-stage" aria-label="Zwei Handlungsspuren öffnen">
          <TraceCard trace={active.dete} open={openedDete} onToggle={()=>toggleTrace('dete')} accent="dete"/>
          <div className="trace-junction" aria-hidden="true"><span>Heidi</span></div>
          <TraceCard trace={active.almoehi} open={openedAlmoehi} onToggle={()=>toggleTrace('almoehi')} accent="almoehi"/>
        </section>

        {!bothOpen&&<div className="focus-feedback waiting" aria-live="polite"><span>↔</span><p><b>{openedDete||openedAlmoehi?'Die Gegenhandlung fehlt noch.':'Noch ist kein Vergleich möglich.'}</b>{openedDete?'Öffne nun den Almöhi: Seine Reaktion kann die Folge von Detes Handlung verschärfen oder begrenzen.':openedAlmoehi?'Öffne nun Dete: Ihr Ausgangspunkt verändert, was der Almöhi überhaupt übernehmen muss.':'Beginne bei einer Person. Die zweite Karte bleibt daneben sichtbar, damit du die erste Spur nicht isoliert beurteilst.'}</p></div>}

        {bothOpen&&<section className="weighing-stage">
          <header><small>Die Folgen gegeneinander halten</small><h4>{active.weighing}</h4></header>
          <div className="focus-scale"><div><b>{active.leftPole}</b><b>{active.rightPole}</b></div><input type="range" min="0" max="100" value={work.weight} onChange={event=>update({weight:+event.target.value})} aria-label={`${active.leftPole} oder ${active.rightPole}`}/><output style={{left:`calc(${work.weight}% - 24px)`}}>{work.weight}</output></div>
          <label className="focus-reason">{active.reasonLabel}<textarea value={work.reason} onChange={event=>update({reason:event.target.value})} placeholder={active.starter}/></label>
          <div className={`focus-feedback ${work.reason.trim()?'responding':'waiting'}`} aria-live="polite"><span>{work.reason.trim()?'✓':'→'}</span><p>{work.reason.trim()&&<em>«{excerpt}{work.reason.trim().length>180?'…':''}»</em>}<b>{active.feedback[feedbackIndex]}</b></p></div>
        </section>}

        {bothOpen&&<section className="probe-stage"><div className="probe-copy"><small>Gegenprobe zu {active.short}</small><h4>{active.probe}</h4></div><div className="probe-options">{active.options.map((option,index)=><button key={option} className={work.probe===index?'active':''} aria-pressed={work.probe===index} onClick={()=>update({probe:index})}><i>{String.fromCharCode(65+index)}</i><span>{option}</span></button>)}</div>{selectedReply&&<div className="probe-reply" aria-live="polite"><span>Deine Wahl verändert die Prüfung:</span><p>{selectedReply}</p></div>}</section>}

        {verdictReady&&<section className="focus-verdict"><header><small>Dein vorläufiges Urteil · {active.short}</small><strong>{work.weight}</strong></header><div className="verdict-path"><article><span>Detes Handlung</span><p>{active.dete.heading}</p></article><i>→</i><article><span>Deine Gewichtung</span><p>{work.reason}</p></article><i>→</i><article><span>Grenze des Urteils</span><p>{selectedReply}</p></article></div><footer><p>Ein tragfähiges Urteil bleibt veränderbar. Öffne die Handlungskarten erneut, verschiebe den Regler oder wähle einen anderen Prüfstein: Die Kette reagiert sofort.</p><button onClick={()=>window.print()}>Dieses Urteil drucken</button></footer></section>}

        <footer className="case-footer"><div>{progress.map((done,index)=><span className={done?'done':''} key={index}>{done?'✓':index+1}</span>)}<p>{!bothOpen?'zwei Handlungen öffnen':!work.reason.trim()?'Folgen für Heidi gewichten':work.probe===null?'den passenden Prüfstein wählen':'Urteil steht – oder wird revidiert'}</p></div><nav><button disabled={cases.findIndex(item=>item.id===activeId)===0} onClick={()=>setActiveId(cases[cases.findIndex(item=>item.id===activeId)-1].id)}>← voriger Konflikt</button><button disabled={cases.findIndex(item=>item.id===activeId)===cases.length-1} onClick={()=>setActiveId(cases[cases.findIndex(item=>item.id===activeId)+1].id)}>nächster Konflikt →</button></nav></footer>
      </main>
    </section>
  </div>;
}

function TraceCard({trace,open,onToggle,accent}:{trace:Trace;open:boolean;onToggle:()=>void;accent:string}){
  return <article className={`trace-card ${accent} ${open?'open':''}`}><button onClick={onToggle} aria-expanded={open}><span><small>Handlungsspur</small><b>{trace.name}</b></span><i>{open?'−':'+'}</i></button><h4>{trace.heading}</h4>{open&&<div><p>{trace.scene}</p><aside><small>Folge für Heidi</small><p>{trace.consequence}</p></aside></div>}</article>;
}

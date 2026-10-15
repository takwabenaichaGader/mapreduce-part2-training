window.EXERCISES = [
  {
    id: 1, level: 1, category: 'Block / InputSplit', title: 'Stocker ou traiter ?',
    image: 'assets/images/block_split.png',
    intro: "Vous préparez un job MapReduce sur un fichier déjà stocké dans HDFS. Deux notions apparaissent dans la documentation : Block et InputSplit.",
    prompt: "Complétez les deux idées avec vos propres mots.", type: 'fields',
    fields: [
      {id:'block', label:'HDFS Block → sert principalement à…', placeholder:'ex. stocker…', answers:['stocker les données','stockage','stocker','stockage hdfs','répartir et stocker les données']},
      {id:'split', label:'InputSplit → sert principalement à…', placeholder:'ex. définir…', answers:['définir le travail du mapper','définir le travail','traitement','définir une portion de traitement','indiquer la partie à traiter','alimenter une tâche map','travail mapreduce']}
    ],
    hint:"Pensez à la question posée par chacun : où sont les données ? versus quel morceau confier au Mapper ?",
    explanation:"Le Block relève du stockage HDFS. L’InputSplit est une unité logique de traitement : il décrit la portion que MapReduce confie généralement à une tâche Map.",
    solution:"Block = stockage ; InputSplit = travail/traitement du Mapper."
  },
  {
    id: 2, level: 1, category:'Block / InputSplit', title:'Combien de Maps ?',
    intro:"Deux fichiers HDFS mesurent 513 MiB et 515 MiB. On suppose des splits proches de 512 MiB et des fichiers splittables.",
    prompt:"Combien de tâches Map sont créées au total ?", type:'numeric', answer:4,
    hint:"Calculez séparément le nombre de splits de chaque fichier.",
    explanation:"513 MiB → 2 splits ; 515 MiB → 2 splits. La capacité du cluster ne crée pas de Maps supplémentaires.", solution:"4 Maps."
  },
  {
    id: 3, level:1, category:'Clé / valeur', title:'Le premier choix de clé',
    image:'assets/images/taxi.png',
    intro:"Vous rejoignez l’équipe Data de la NYC Taxi & Limousine Commission. On vous demande : « Combien de trajets partent de chaque zone ? »",
    prompt:"Construisez la paire émise par Map pour chaque trajet.", type:'fields',
    fields:[
      {id:'key', label:'Clé Map', placeholder:'attribut...', answers:['pulocationid','pu location id','zone','zone de départ','pickup zone','zone depart']},
      {id:'value', label:'Valeur Map', placeholder:'valeur minimale...', answers:['1','un']}
    ],
    hint:"La clé doit représenter le regroupement demandé. La valeur n’a besoin que de porter une unité de comptage.",
    explanation:"Pour compter les trajets par zone de départ : Map émet (PULocationID, 1).", solution:"(PULocationID, 1)"
  },
  {
    id:4, level:1, category:'Map', title:'Produire les couples Map',
    image:'assets/images/map_phase.png',
    intro:"On veut compter les trajets par zone. Les quatre trajets sont : T1 zone 132, T2 zone 161, T3 zone 132, T4 zone 237.",
    prompt:"Écrivez chaque paire sous la forme (clé,valeur).", type:'fields',
    fields:[
      {id:'t1',label:'T1',placeholder:'(…, …)',answers:['132,1','(132,1)','132 1']},
      {id:'t2',label:'T2',placeholder:'(…, …)',answers:['161,1','(161,1)','161 1']},
      {id:'t3',label:'T3',placeholder:'(…, …)',answers:['132,1','(132,1)','132 1']},
      {id:'t4',label:'T4',placeholder:'(…, …)',answers:['237,1','(237,1)','237 1']}
    ],
    hint:"Même règle pour chaque ligne : zone de départ comme clé, 1 comme valeur.", explanation:"Chaque Mapper transforme indépendamment l’enregistrement en couple clé-valeur.", solution:"T1 (132,1), T2 (161,1), T3 (132,1), T4 (237,1)."
  },
  {
    id:5, level:1, category:'Clé / valeur', title:'WordCount sans réciter le cours',
    intro:"Vous devez compter les occurrences des mots dans un grand corpus de logs textuels.",
    prompt:"Quelle paire minimale Map doit-elle émettre pour chaque mot ?", type:'fields',
    fields:[
      {id:'key',label:'Clé',placeholder:'...',answers:['mot','word']},
      {id:'value',label:'Valeur',placeholder:'...',answers:['1','un']}
    ],
    hint:"La clé doit permettre de regrouper toutes les occurrences du même terme.", explanation:"WordCount utilise (mot,1). Le cas est simple, mais la logique clé → regroupement → agrégation est générale.", solution:"(mot, 1)"
  },
  {
    id:6, level:1, category:'YARN', title:'Même mot, deux concepts différents',
    image:'assets/images/yarn_docker.png',
    intro:"Un étudiant affirme : « Un YARN container est forcément un Docker container. »",
    prompt:"Choisissez la meilleure réponse.", type:'mcq',
    choices:["Oui, ce sont deux synonymes.","Non. YARN alloue des ressources ; Docker fournit un environnement d’exécution isolé.","Oui, mais uniquement pour les Reducers.","Non, parce que Docker n’utilise jamais CPU ni mémoire."], correct:1,
    hint:"Dans le cours, YARN parle d’allocation logique de CPU/mémoire ; Docker parle aussi d’image, filesystem, namespaces et cgroups.", explanation:"Les deux abstractions sont distinctes. YARN peut toutefois utiliser Docker comme runtime dans certaines configurations.", solution:"Réponse 2."
  },
  {
    id:7, level:1, category:'Data locality', title:'Déplacer quoi ?',
    image:'assets/images/data_locality.png',
    intro:"Un bloc HDFS de 4 Go est déjà sur le nœud N3. Le programme Map ne pèse que 200 Ko.",
    prompt:"Quelle stratégie est la plus cohérente ?", type:'mcq',
    choices:["Transférer les 4 Go vers une machine distante.","Exécuter le petit programme près du bloc.","Copier systématiquement le bloc vers tous les nœuds.","Envoyer les données au NameNode pour calculer."], correct:1,
    hint:"Comparez la quantité de données à déplacer.", explanation:"La data locality cherche à déplacer le petit calcul vers les grosses données afin d’économiser la bande passante réseau.", solution:"Exécuter Map près du bloc."
  },
  {
    id:8, level:1, category:'YARN', title:'Pourquoi YARN ?',
    image:'assets/images/mrv1.png',
    intro:"Dans MRv1, le JobTracker concentre gestion des ressources, ordonnancement et suivi des jobs.",
    prompt:"Quelle évolution caractérise le mieux YARN ?", type:'mcq',
    choices:["Ajouter encore plus de responsabilités au JobTracker.","Séparer la gestion globale des ressources de la gestion propre à chaque application.","Supprimer toute allocation dynamique.","Remplacer HDFS par Docker."], correct:1,
    hint:"La scalabilité vient aussi de la séparation des rôles.", explanation:"YARN sépare notamment ResourceManager, NodeManagers et ApplicationMaster, et n’est plus limité à un seul moteur de traitement.", solution:"Séparation de la gestion globale des ressources et de la logique applicative."
  },
  {
    id:9, level:2, category:'Clé / valeur', title:'Changer la question, changer la clé',
    image:'assets/images/taxi.png',
    intro:"Même dataset NYC Taxi, trois questions différentes.",
    prompt:"Donnez la clé Map la plus naturelle pour chaque question.", type:'fields',
    fields:[
      {id:'zone',label:'Nombre de trajets par zone',placeholder:'clé...',answers:['pulocationid','zone','zone de départ','pickup zone']},
      {id:'hour',label:'Nombre de trajets par heure',placeholder:'clé...',answers:['heure','hour','heure de départ','hour(pickup)','pickup hour']},
      {id:'payment',label:'Répartition par mode de paiement',placeholder:'clé...',answers:['payment_type','payment type','mode de paiement','paiement']}
    ],
    hint:"La clé encode directement l’axe selon lequel vous voulez regrouper les données.", explanation:"Zone → PULocationID ; temps → heure de pickup ; paiement → payment_type.", solution:"PULocationID ; heure(pickup) ; payment_type."
  },
  {
    id:10, level:2, category:'Clé / valeur', title:'Revenu par zone',
    image:'assets/images/taxi_result.png',
    intro:"L’équipe métier ne veut plus compter les trajets. Elle veut connaître le revenu total généré par chaque zone de départ.",
    prompt:"Complétez la paire Map.", type:'fields',
    fields:[
      {id:'key',label:'Clé',placeholder:'...',answers:['pulocationid','zone','zone de départ','pickup zone']},
      {id:'value',label:'Valeur',placeholder:'...',answers:['total_amount','total amount','montant total','revenu','amount']}
    ],
    hint:"Le regroupement reste géographique ; seule la mesure à agréger change.", explanation:"La clé est PULocationID et la valeur est total_amount. Le Reducer additionnera les montants par zone.", solution:"(PULocationID, total_amount)"
  },
  {
    id:11, level:2, category:'Cas métier', title:'E-commerce : chiffre d’affaires par produit',
    image:'assets/images/ecommerce.png',
    intro:"Une plateforme e-commerce possède des centaines de millions de lignes : product_id, quantity, price.",
    prompt:"Concevez la paire Map pour calculer le chiffre d’affaires par produit.", type:'fields',
    fields:[
      {id:'key',label:'Clé',placeholder:'...',answers:['product_id','product id','produit','id produit']},
      {id:'value',label:'Valeur',placeholder:'...',answers:['quantity*price','quantity * price','quantite*prix','quantité*prix','quantity x price','quantity price','chiffre d’affaires ligne','montant de la ligne']}
    ],
    hint:"La valeur doit être additive avant le Reduce.", explanation:"Map émet (product_id, quantity × price), puis Reduce somme les valeurs de chaque produit.", solution:"(product_id, quantity × price)"
  },
  {
    id:12, level:2, category:'Cas métier', title:'IoT industriel : qui génère les alertes ?',
    image:'assets/images/iot.png',
    intro:"Une usine connectée collecte timestamp, machine_id, alert_type pour des millions d’événements.",
    prompt:"Construisez la paire Map pour compter le nombre d’alertes par machine.", type:'fields',
    fields:[
      {id:'key',label:'Clé',placeholder:'...',answers:['machine_id','machine id','machine','id machine']},
      {id:'value',label:'Valeur',placeholder:'...',answers:['1','un']}
    ],
    hint:"La clé doit identifier l’équipement dont on veut compter les événements.", explanation:"Map émet (machine_id,1), Shuffle regroupe par machine, Reduce additionne.", solution:"(machine_id, 1)"
  },
  {
    id:13, level:2, category:'Cas métier', title:'Logs Web : quelles URL dominent ?',
    image:'assets/images/web_logs.png',
    intro:"Chaque log contient timestamp, user, URL, status. Le responsable veut le nombre de requêtes par URL.",
    prompt:"Quelle paire Map est la plus directe ?", type:'fields',
    fields:[
      {id:'key',label:'Clé',placeholder:'...',answers:['url','URL']},
      {id:'value',label:'Valeur',placeholder:'...',answers:['1','un']}
    ],
    hint:"Chaque requête compte une fois pour son URL.", explanation:"(URL,1) permet de regrouper toutes les requêtes ciblant la même ressource.", solution:"(URL, 1)"
  },
  {
    id:14, level:2, category:'Shuffle / Sort', title:'Reconstruire le Shuffle',
    image:'assets/images/shuffle.png',
    intro:"Trois Mappers produisent : M1 → (A,1),(B,1) ; M2 → (A,1),(C,1) ; M3 → (B,1),(A,1),(C,1).",
    prompt:"Après Shuffle + Sort, complétez les groupes de valeurs.", type:'fields',
    fields:[
      {id:'a',label:'A →',placeholder:'ex. [1,1,…]',answers:['[1,1,1]','1,1,1','111']},
      {id:'b',label:'B →',placeholder:'...',answers:['[1,1]','1,1','11']},
      {id:'c',label:'C →',placeholder:'...',answers:['[1,1]','1,1','11']}
    ],
    hint:"Le Shuffle rassemble toutes les valeurs partageant la même clé, quel que soit leur Mapper d’origine.", explanation:"A reçoit 3 valeurs ; B en reçoit 2 ; C en reçoit 2.", solution:"A→[1,1,1], B→[1,1], C→[1,1]."
  },
  {
    id:15, level:2, category:'Reduce', title:'Agrégation finale',
    image:'assets/images/reduce.png',
    intro:"Après Shuffle, trois zones arrivent au Reduce : 132→[1,1,1,1,1], 161→[1,1], 237→[1,1,1].",
    prompt:"Donnez le résultat final pour chaque clé.", type:'fields',
    fields:[
      {id:'z132',label:'132 →',placeholder:'...',answers:['5','cinq']},
      {id:'z161',label:'161 →',placeholder:'...',answers:['2','deux']},
      {id:'z237',label:'237 →',placeholder:'...',answers:['3','trois']}
    ],
    hint:"Ici Reduce effectue simplement une somme des valeurs.", explanation:"Reduce reçoit la clé et toutes ses valeurs, puis applique l’agrégation demandée.", solution:"132→5, 161→2, 237→3."
  },
  {
    id:16, level:2, category:'Combiner', title:'Pré-agréger localement',
    image:'assets/images/combiner.png',
    intro:"Un Mapper produit localement : 132→1, 132→1, 132→1, 132→1, 161→1.",
    prompt:"Que peut transmettre un Combiner avant le Shuffle ?", type:'fields',
    fields:[
      {id:'z132',label:'132 →',placeholder:'...',answers:['4','quatre']},
      {id:'z161',label:'161 →',placeholder:'...',answers:['1','un']}
    ],
    hint:"Pré-agrégez uniquement à l’intérieur du Mapper sans modifier le résultat final.", explanation:"Le Combiner peut réduire 5 couples à 2 couples : (132,4) et (161,1).", solution:"132→4 ; 161→1."
  },
  {
    id:17, level:2, category:'Moyenne distribuée', title:'Pourquoi mean(mean(...)) est faux ?',
    intro:"Machine A : 10 trajets, moyenne 4 km. Machine B : 100 trajets, moyenne 10 km.",
    prompt:"Quelles deux informations faut-il conserver localement pour recomposer correctement la moyenne globale ?", type:'fields',
    fields:[
      {id:'first',label:'Information 1',placeholder:'...',answers:['sum_distance','sum distance','somme des distances','somme distance','somme']},
      {id:'second',label:'Information 2',placeholder:'...',answers:['count','nombre','compte','nombre de trajets','nb trajets']}
    ],
    hint:"Une moyenne seule ne conserve pas la taille du groupe qui l’a produite.", explanation:"Il faut conserver (sum_distance,count), puis calculer sum(sum_distance)/sum(count).", solution:"(sum_distance, count)"
  },
  {
    id:18, level:2, category:'Block / InputSplit', title:'Taille de fichier et nombre de Maps',
    intro:"Un fichier splittable fait 5000 MiB. La taille de split est proche de 512 MiB.",
    prompt:"Combien de Maps obtient-on approximativement ?", type:'numeric', answer:10,
    hint:"Utilisez l’arrondi supérieur de 5000 / 512.", explanation:"⌈5000/512⌉ = 10. Cette estimation suppose un InputFormat dont les splits suivent approximativement la taille de bloc.", solution:"10 Maps."
  },
  {
    id:19, level:2, category:'Shuffle / Sort', title:'Le coût du Shuffle en chiffres',
    image:'assets/images/shuffle.png',
    intro:"100 millions d’événements produisent chacun 20 octets de sortie Map, avant compression et overhead réseau.",
    prompt:"Quel volume intermédiaire cela représente approximativement ?", type:'fields',
    fields:[{id:'vol',label:'Volume',placeholder:'ex. 2 Go',answers:['2 go','2go','2 gb','2gb','2000 mo','2000mb','2000000000 octets','2 milliards d octets']}],
    hint:"100 000 000 × 20 octets.", explanation:"Environ 2 Go. C’est pourquoi réduire les sorties Map avant le réseau peut changer fortement le coût du job.", solution:"≈ 2 Go."
  },
  {
    id:20, level:2, category:'Data locality', title:'Justifier une décision d’architecture',
    image:'assets/images/data_locality.png',
    intro:"Le bloc est local sur N3. Un collègue propose de le transférer vers N7, où le CPU est légèrement plus libre.",
    prompt:"Expliquez brièvement pourquoi Hadoop peut préférer N3.", type:'open',
    keywords:[['réseau','bande passante','transfert'],['données','bloc'],['code','calcul','map']], minGroups:2,
    hint:"Comparez le coût de déplacer des gigaoctets de données avec celui de lancer un petit calcul près du bloc.", explanation:"La data locality minimise les transferts réseau : exécuter Map près du bloc coûte souvent moins cher que déplacer plusieurs Go de données.", solution:"Préférer N3 pour rapprocher le calcul des données et économiser la bande passante."
  },
  {
    id:21, level:3, category:'Diagnostic', title:'Corriger un Mapper incorrect',
    intro:"Objectif : chiffre d’affaires par zone. Un étudiant propose : emit(total_amount, PULocationID).",
    prompt:"Corrigez la paire.", type:'fields',
    fields:[
      {id:'key',label:'Clé correcte',placeholder:'...',answers:['pulocationid','zone','zone de départ']},
      {id:'value',label:'Valeur correcte',placeholder:'...',answers:['total_amount','total amount','montant total','revenu']}
    ],
    hint:"La clé représente le groupe final ; la valeur représente la mesure à additionner.", explanation:"L’étudiant a inversé l’axe d’agrégation et la mesure. Il faut (PULocationID,total_amount).", solution:"(PULocationID, total_amount)"
  },
  {
    id:22, level:3, category:'Conception', title:'Demande taxi du matin',
    image:'assets/images/taxi.png',
    intro:"L’équipe opérationnelle veut compter les trajets par zone uniquement entre 7h et 10h.",
    prompt:"Définissez le filtre et la paire Map.", type:'fields',
    fields:[
      {id:'filter',label:'Filtre temporel',placeholder:'...',answers:['7h à 10h','7h-10h','entre 7h et 10h','7 <= heure < 10','7<=heure<10','07:00 10:00']},
      {id:'key',label:'Clé',placeholder:'...',answers:['pulocationid','zone','zone de départ']},
      {id:'value',label:'Valeur',placeholder:'...',answers:['1','un']}
    ],
    hint:"Filtrer d’abord les trajets du créneau, puis compter par zone.", explanation:"Filtrer l’heure de pickup, puis émettre (PULocationID,1).", solution:"Filtre 7h–10h ; clé PULocationID ; valeur 1."
  },
  {
    id:23, level:3, category:'Top-N', title:'Un Top-10 global en une seule étape ?',
    intro:"Après un premier job, chaque Reducer possède des revenus par zone. Vous voulez le Top-10 global des zones.",
    prompt:"Une seule agrégation indépendante par Reducer garantit-elle directement le Top-10 global ?", type:'mcq',
    choices:["Oui, toujours.","Non. Il faut généralement une consolidation globale supplémentaire ou une stratégie équivalente.","Oui, si le facteur de réplication vaut 3.","Non, parce que Reduce ne sait jamais trier."], correct:1,
    hint:"Chaque Reducer ne voit qu’une partie des clés qui lui sont affectées.", explanation:"Un Top-N global demande généralement une seconde étape de consolidation ou une autre stratégie de fusion globale.", solution:"Non : consolidation globale nécessaire."
  },
  {
    id:24, level:3, category:'Data skew', title:'Le Reducer qui bloque tout le job',
    image:'assets/images/data_skew.png',
    intro:"Zone A concentre 65 % des trajets ; B 10 %, C 8 %, le reste est dispersé.",
    prompt:"Quel phénomène risque d’apparaître ?", type:'mcq',
    choices:["Tous les Reducers finissent exactement en même temps.","Un Reducer chargé de A devient un straggler et retarde le job.","HDFS supprime automatiquement la clé A.","Le NameNode calcule la somme à la place du Reducer."], correct:1,
    hint:"Le partitionnement envoie toutes les valeurs d’une même clé vers le même Reducer.", explanation:"Une clé chaude peut concentrer une charge disproportionnée sur un seul Reducer ; les autres terminent tôt et attendent le straggler.", solution:"Data skew → Reducer surchargé / straggler."
  },
  {
    id:25, level:3, category:'Salting', title:'Répartir une clé chaude',
    image:'assets/images/salting.png',
    intro:"La clé Airport concentre une très grande partie des trajets.",
    prompt:"Proposez une forme simple de salting temporaire.", type:'fields',
    fields:[{id:'salt',label:'Exemple de sous-clés',placeholder:'Airport_1, ...',answers:['airport_1 airport_2 airport_3 airport_4','airport_1,airport_2,airport_3,airport_4','airport1 airport2 airport3 airport4','airport_1 airport_2']}],
    hint:"Ajoutez un suffixe temporaire pour distribuer la charge sur plusieurs clés.", explanation:"Le salting répartit temporairement une clé chaude (ex. Airport_1…Airport_4), puis une seconde agrégation reconstitue Airport.", solution:"Ex. Airport_1, Airport_2, Airport_3, Airport_4."
  },
  {
    id:26, level:3, category:'Moyenne distribuée', title:'Distance moyenne par zone',
    intro:"Vous voulez la distance moyenne des trajets pour chaque PULocationID, sur un très grand dataset.",
    prompt:"Que doit émettre Map pour permettre une moyenne exacte et combinable ?", type:'fields',
    fields:[
      {id:'key',label:'Clé',placeholder:'...',answers:['pulocationid','zone','zone de départ']},
      {id:'value',label:'Valeur structurée',placeholder:'ex. (distance,1)',answers:['distance,1','(distance,1)','trip_distance,1','(trip_distance,1)','distance 1']}
    ],
    hint:"Conservez simultanément la somme potentielle et le nombre d’observations.", explanation:"Map peut émettre (zone,(distance,1)). Combiner/Reduce additionnent les distances et les comptes avant de diviser.", solution:"(PULocationID, (distance,1))"
  },
  {
    id:27, level:3, category:'YARN', title:'Remettre le job YARN dans l’ordre',
    image:'assets/images/yarn.png',
    intro:"Un client soumet un job MapReduce. Remettez les grandes étapes dans l’ordre logique.",
    prompt:"Choisissez la séquence correcte.", type:'mcq',
    choices:[
      "NodeManager → client → ResourceManager → ApplicationMaster",
      "Client → ResourceManager → ApplicationMaster → NodeManagers/containers",
      "Client → DataNode → NameNode → Docker",
      "ApplicationMaster → client → NameNode → JobTracker"
    ], correct:1,
    hint:"Le client commence par contacter le gestionnaire global des ressources.", explanation:"Le client soumet au ResourceManager ; YARN démarre un ApplicationMaster ; celui-ci négocie des containers ; les NodeManagers lancent les tâches.", solution:"Client → ResourceManager → ApplicationMaster → NodeManagers/containers."
  },
  {
    id:28, level:3, category:'YARN', title:'Qui fait quoi dans YARN ?',
    image:'assets/images/yarn.png',
    intro:"Associez chaque rôle au bon composant.",
    prompt:"Complétez les trois champs.", type:'fields',
    fields:[
      {id:'rm',label:'Arbitre global des ressources',placeholder:'...',answers:['resourcemanager','resource manager']},
      {id:'nm',label:'Agent de chaque machine',placeholder:'...',answers:['nodemanager','node manager']},
      {id:'am',label:'Gestion propre à l’application',placeholder:'...',answers:['applicationmaster','application master']}
    ],
    hint:"Pensez global / local / application.", explanation:"ResourceManager = global ; NodeManager = agent local ; ApplicationMaster = orchestration propre à l’application.", solution:"ResourceManager ; NodeManager ; ApplicationMaster."
  },
  {
    id:29, level:4, category:'Mission intégratrice', title:'Mission NYC Morning Demand',
    image:'assets/images/taxi_result.png',
    intro:"Mission : identifier les zones ayant la plus forte demande entre 7h et 10h, puis produire un Top-10 exploitable.",
    prompt:"Concevez les éléments essentiels du traitement.", type:'fields',
    fields:[
      {id:'filter',label:'1. Filtre',placeholder:'...',answers:['7h à 10h','7h-10h','entre 7h et 10h','7<=heure<10','7 <= heure < 10']},
      {id:'key',label:'2. Clé Map',placeholder:'...',answers:['pulocationid','zone','zone de départ']},
      {id:'value',label:'3. Valeur Map',placeholder:'...',answers:['1','un']},
      {id:'reduce',label:'4. Agrégation Reduce',placeholder:'...',answers:['somme','sum','compter','count','somme des 1','additionner les valeurs']},
      {id:'combiner',label:'5. Combiner utile ?',placeholder:'oui/non + idée',answers:['oui','oui somme locale','oui comptage local','yes']}
    ],
    hint:"Compter par zone est associatif et commutatif, donc une pré-agrégation locale est possible. Le Top-10 global vient après les comptes globaux.", explanation:"Filtrer 7h–10h, émettre (PULocationID,1), combiner localement, réduire par somme, puis consolider/classer pour obtenir le Top-10.", solution:"Filtre 7–10 ; clé PULocationID ; valeur 1 ; somme ; Combiner oui ; puis consolidation Top-10."
  },
  {
    id:30, level:4, category:'Mission intégratrice', title:'Mission usine intelligente',
    image:'assets/images/iot.png',
    intro:"Une usine produit des millions d’événements : timestamp, machine_id, temperature, vibration, alert_type. On veut les 10 machines générant le plus d’alertes critiques.",
    prompt:"Définissez le cœur du premier traitement MapReduce.", type:'fields',
    fields:[
      {id:'filter',label:'Filtre',placeholder:'...',answers:['alert_type critique','alert_type=critical','critical','alertes critiques','critique']},
      {id:'key',label:'Clé Map',placeholder:'...',answers:['machine_id','machine id','machine']},
      {id:'value',label:'Valeur Map',placeholder:'...',answers:['1','un']},
      {id:'reduce',label:'Reduce',placeholder:'...',answers:['somme','sum','compter','count','additionner']}
    ],
    hint:"Commencez par filtrer les événements critiques, puis comptez par équipement. Le Top-10 est une étape globale après l’agrégation.", explanation:"Filtrer les alertes critiques, émettre (machine_id,1), sommer par machine puis produire un Top-10 global dans une étape de consolidation.", solution:"Filtre alert_type=critical ; clé machine_id ; valeur 1 ; Reduce=sum ; puis Top-10 global."
  }
];

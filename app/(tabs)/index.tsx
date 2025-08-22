import * as Speech from 'expo-speech';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

// Define translations in one unified array
interface Translation {
  language: string;
  text: string;
}

const translations: Translation[] = [
  { 
    language: "Latin", 
    text: "Sono vinculo omnes principatus daemonici et satanici" 
  },
  { 
    language: "Greek", 
    text: "Εγώ φαντάζομαι όλον τους δαιμόνιους και σατανικούς αρχέπους" 
  },
  { 
    language: "French", 
    text: "Je lie tous les principautés diaboliques et sataniques" 
  },
  { 
    language: "Spanish", 
    text: "Lijo a todos los principados demoníacos y satánicos" 
  },
  { 
    language: "German", 
    text: "Ich bande alle diabolischen und satanischen Fürsten"
  },
  { 
    language: "Italian", 
    text: "Lietto tutti i principati demoniaci e satánicos" 
  },
  { 
    language: "Portuguese (Brazil)", 
    text: "Eu vinculo todos os principados demoníacos e satánicos"
  },
  { 
    language: "Dutch", 
    text: "Ik bond alle demonische en satanische prinsen" 
  },
  { 
    language: "Russian", 
    text: "Я связываю всех даймонов и сатанских princelev" 
  },
  { 
    language: "Japanese", 
    text: "Watashi wa, yūjō suru zenmē no sei shinju" 
  },
  { 
    language: "Korean (Hangul)", 
    text: "나는 모든 악마적이고 사탄적인 권세들을 묶고, 그들의 공격을 그들 자신에게 되돌린다." 
  },
  { 
    language: "Arabic",
    text: "Al-'Azīz 'al-Ḥamīr"
  },
  { 
    language: "Hebrew", 
    text: "Ha-Qodesh Ha-Kol" 
  },
  {
    language: "Hebrew (Unknown) Translation",
    text: "אֲנִי אוֹסֵר כָּל שֵׁדִים וְשָׂטָנִים וּמַתִּיר אֶת הַתַּקָּפוֹת שֶׁלָּהֶם עֲלֵיהֶם. אֲנָא אֲסַר כָּל רוּחֵי בִישָׁא וְשָׂטָנָא וְשָׁרֵי תְּקוּפֵיהוֹן עֲלֵיהוֹן."
  },
  {
    language: "English",
    text: "I bind all demonic and satanic principalities, and I return the demonic and satanic principalities’ attacks onto those same demonic and satanic principalities."
  },
  {
    language: "Latin",
    text: "Alligo omnes principatus daemonicos et satanicos, et reddo impetus principatuum daemoniorum et satanicorum in eosdem principatus daemonicos et satanicos."
  },
  {
    language: "Pig Latin",
    text: "I-bay ind-bay all-way emonic-day and-way atanic-say incipalities-pray and-way oose-lay eir-thay attacks-way ack-bay onto-way em-thay.",
  },
  {
    language: "Greek (Koine)",
    text: "Δέω πάσας τὰς δαιμονικὰς καὶ σατανικὰς ἀρχάς, καὶ ἐπιστρέφω τὰς ἐπιθέσεις τῶν δαιμονικῶν καὶ σατανικῶν ἀρχῶν ἐπ᾿ αὐτὰς τὰς δαιμονικὰς καὶ σατανικὰς ἀρχάς."
  },
  {
    language: "Hebrew (Biblical)",
    text: "אני קושר את כל השררות השטניות והשדים, ומחזיר את התקפות השררות השטניות והשדים על אותן השררות השטניות והשדים עצמם."
  },
  {
    language: "Aramaic (Syriac)",
    text: "ܐܶܣܘܪ ܠܟܠܗܽܘܢ ܪ̈ܝܫܝܼ ܕܡܽܘܢܐ ܘܣܰܛܢܐ, ܘܡܶܗܦܶܟ ܠܡܚܰܝܐ ܕܪ̈ܝܼܫܝܼ ܕܡܽܘܢܐ ܘܣܰܛܢܐ ܥܠ ܗܽܘܢ ܒܗܽܘܢ ܪ̈ܝܼܫܝܼ ܕܡܽܘܢܐ ܘܣܰܛܢܐ."
  },
  {
    language: "Spanish",
    text: "Yo ato a todos los principados demoníacos y satánicos, y devuelvo los ataques de los principados demoníacos y satánicos contra esos mismos principados demoníacos y satánicos."
  },
  {
    language: "French",
    text: "Je lie toutes les principautés démoniaques et sataniques, et je retourne les attaques des principautés démoniaques et sataniques contre ces mêmes principautés démoniaques et sataniques."
  },
  {
    language: "German",
    text: "Ich binde alle dämonischen und satanischen Fürstentümer, und ich sende die Angriffe der dämonischen und satanischen Fürstentümer zurück gegen eben jene dämonischen und satanischen Fürstentümer."
  },
  {
    language: "Italian",
    text: "Io lego tutti i principati demoniaci e satanici, e restituisco gli attacchi dei principati demoniaci e satanici contro quegli stessi principati demoniaci e satanici."
  },
  {
    language: "Portuguese",
    text: "Eu amarro todos os principados demoníacos e satânicos, e devolvo os ataques dos principados demoníacos e satânicos contra esses mesmos principados demoníacos e satânicos."
  },
  {
    language: "Dutch",
    text: "Ik bind alle demonische en satanische vorstendommen, en ik keer de aanvallen van de demonische en satanische vorstendommen terug op diezelfde demonische en satanische vorstendommen."
  },
  {
    language: "Russian",
    text: "Я связываю все демонические и сатанинские начальства, и возвращаю атаки демонических и сатанинских начальств обратно на те же самые демонические и сатанинские начальства."
  },
  {
    language: "Arabic",
    text: "أقيّد كل الرئاسات الشيطانية والإبليسية، وأرد هجمات الرئاسات الشيطانية والإبليسية على تلك الرئاسات الشيطانية والإبليسية نفسها."
  },
  {
    language: "Japanese",
    text: "私はすべての悪魔的でサタン的な支配者を縛り、その悪魔的でサタン的な支配者たちの攻撃を同じ悪魔的でサタン的な支配者たちに返します。"
  },
  {
    language: "Korean",
    text: "나는 모든 악마적이고 사탄적인 권세들을 묶고, 그 악마적이고 사탄적인 권세들의 공격을 그 동일한 악마적이고 사탄적인 권세들에게 되돌린다."
  },
  {
    language: "Chinese (Mandarin, Simplified)",
    text: "我捆绑所有邪恶和撒但的掌权者，并将这些邪恶和撒但的掌权者的攻击归还给这些同样的邪恶和撒但的掌权者。"
  },
  {
    language: "Sanskrit",
    text: "अहं सर्वाणि दैत्य-सैतानी प्रधानानि बध्नामि, तेषां दैत्य-सैतानी प्रधानानां आक्रमणानि तेषु एव दैत्य-सैतानी प्रधानेषु प्रत्यनयामि।"
  },
  {
    language: "Old Norse",
    text: "Ek bindr alla púkdóma ok sataníska höfðinga, ok sendi aptr árásir púkdóma ok satanískra höfðinga á pá sömu púkdóma ok sataníska höfðinga."
  },
  {
    language: "Coptic",
    text: "Ⲁⲛⲟⲕ ⲟⲩⲱϣⲉ ⲛ̀ⲛⲉⲩⲁⲣⲭⲏ ⲛⲧⲉ ⲛⲉⲥⲓⲟⲩⲧ ⲛⲉⲙ ⲥⲁⲧⲁⲛⲓⲕⲟⲛ, ⲛⲉⲙ ⲡⲉⲣⲓⲧⲉⲛⲉ ⲛ̀ⲧⲉ ⲛⲉⲩⲁⲣⲭⲏ ⲛⲧⲉ ⲛⲉⲥⲓⲟⲩⲧ ⲛⲉⲙ ⲥⲁⲧⲁⲛⲓⲕⲟⲛ ⲉϥⲉⲣϣⲟⲩⲱⲟⲩ ⲉϩⲣⲁⲓ ⲉⲛⲉϥϣⲏⲣⲉ ⲛ̀ⲧⲉ ⲛⲉⲩⲁⲣⲭⲏ."
  },
  {
    language: "Hexadecimal",
    text: "49 20 62 69 6E 64 20 61 6C 6C 20 64 65 6D 6F 6E 69 63 20 61 6E 64 20 73 61 74 61 6E 69 63 20 70 72 69 6E 63 69 70 61 6C 69 74 69 65 73"
  },
  {
    language: "Binary",
    text: "01001001 00100000 01100010 01101001 01101110 01100100 00100000 01100001 01101100 01101100 00100000 01100100 01100101 01101101 01101111 01101110 01101001 01100011 00100000 01100001 01101110 01100100 00100000 01110011 01100001 01110100 01100001 01101110 01101001 01100011 00100000 01110000 01110010 01101001 01101110 01100011 01101001 01110000 01100001 01101100 01101001 01110100 01101001 01100101 01110011"
  }
];

// Utility: shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper: speak and await finish
function speakAsync(text: string): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(text, {
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}

export default function HomeScreen(): JSX.Element {
  const queueRef = useRef<Translation[]>([]);
  const indexRef = useRef<number>(0);
  const [isLooping, setIsLooping] = useState(false);
  const stoppedRef = useRef(false);

  const loopSpeak = async () => {
    while (!stoppedRef.current) {
      if (!queueRef.current.length || indexRef.current >= queueRef.current.length) {
        queueRef.current = shuffleArray(translations);
        indexRef.current = 0;
      }

      const current = queueRef.current[indexRef.current];
      indexRef.current += 1;

      await speakAsync(current.text);

      // Delay between phrases
      await new Promise((r) => setTimeout(r, 1000));
    }
  };

  const startLoop = () => {
    if (!isLooping) {
      stoppedRef.current = false;
      setIsLooping(true);
      queueRef.current = shuffleArray(translations);
      indexRef.current = 0;
      loopSpeak();
    }
  };

  const stopLoop = () => {
    stoppedRef.current = true;
    Speech.stop();
    setIsLooping(false);
  };

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      Speech.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/prayers.jpg')}
        style={{ width: 375, height: 500 }}
        resizeMode="center"
      />
      <Button title="Start Prayers" onPress={startLoop} disabled={isLooping} />
      <Button title="Stop" onPress={stopLoop} disabled={!isLooping} />
      <Text>© Christ Kingdom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12, flex: 1, justifyContent: 'center' },
});

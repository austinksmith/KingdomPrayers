import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

const texts: string[] = [
    "Ligo omnes potestates daemonicas et satanicas et solvo impetus eorum contra ipsos.",
    "Δέω πάσας τὰς δαιμονικὰς καὶ σατανικὰς ἀρχὰς καὶ λύω τὰς ἐπιθέσεις αὐτῶν εἰς αὐτούς.",
    "אֲנִי אוֹסֵר כָּל שֵׁדִים וְשָׂטָנִים וּמַתִּיר אֶת הַתַּקָּפוֹת שֶׁלָּהֶם עֲלֵיהֶם.",
    "אֲנָא אֲסַר כָּל רוּחֵי בִישָׁא וְשָׂטָנָא וְשָׁרֵי תְּקוּפֵיהוֹן עֲלֵיהוֹן.",
    "Свѧзываю всѧ дьявольска и сатаниньска началꙗ и отпущаѭ нападениꙗ иꙗже на нѣхъ.",
    "01001001 00100000 01100010 01101001 01101110 01100100 00100000 01100001 01101100 01101100 00100000 01100100 01100101 01101101 01101111 01101110 01101001 01100011 00100000 01100001 01101110 01100100 00100000 01110011 01100001 01110100 01100001 01101110 01101001 01100011 00100000 01110000 01110010 01101001 01101110 01100011 01101001 01110000 01100001 01101100 01101001 01110100 01101001 01100101 01110011 00100000 01100001 01101110 01100100 00100000 01101100 01101111 01101111 01110011 01100101 00100000 01110100 01101000 01100101 01101001 01110010 00100000 01100001 01110100 01110100 01100001 01100011 01101011 01110011 00100000 01100010 01100001 01100011 01101011 00100000 01101111 01101110 01110100 01101111 00100000 01110100 01101000 01100101 01101101",
    "I-bay ind-bay all-way emonic-day and-way atanic-say incipalities-pray and-way oose-lay eir-thay attacks-way ack-bay onto-way em-thay.",
    "Enā āsēr kulhūn rūḥē bishātā w-Sāṭānā, w-shārē tequpēhon ‘alayhon.",
    "Alligō omnēs potestātēs daemonicās atque satanicās, et solvō impetūs eōrum in ipsōs."
];

// Helper function that returns a Promise resolving when speech finishes
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
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef<number>(0);
  const [isLooping, setIsLooping] = useState(false);
  const stoppedRef = useRef(false);

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Async function to handle the loop
  const loopSpeak = async () => {
    while (!stoppedRef.current) {
      if (!queueRef.current.length || indexRef.current >= queueRef.current.length) {
        queueRef.current = shuffleArray(texts);
        indexRef.current = 0;
      }

      const currentText = queueRef.current[indexRef.current];
      indexRef.current += 1;

      await speakAsync(currentText);

      // small delay between phrases
      await new Promise((r) => setTimeout(r, 1000));
    }
  };

  const startLoop = () => {
    if (!isLooping) {
      stoppedRef.current = false;
      setIsLooping(true);
      queueRef.current = shuffleArray(texts);
      indexRef.current = 0;
      loopSpeak();
    }
  };

  const stopLoop = () => {
    stoppedRef.current = true;
    Speech.stop();
    setIsLooping(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      Speech.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/prayers.jpg')}
        style={{ width: 375, height: 500 }}
        resizeMode="center"
      />
      <Button title="Start Prayers" onPress={startLoop} disabled={isLooping} />
      <Button title="Stop" onPress={stopLoop} disabled={!isLooping} />
      <Text>&copy; Christ Kingdom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12, flex: 1, justifyContent: 'center' },
});

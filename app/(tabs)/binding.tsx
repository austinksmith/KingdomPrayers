import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { JSX, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Convert a language string to safe filename
const langToFilePrefix = (lang: string) =>
  lang.replace(/[^a-z0-9]/gi, "_").toLowerCase();

export default function HomeScreen(): JSX.Element {
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queueRef = useRef<{ language: string }[]>([]);
  const indexRef = useRef(0);
  const stoppedRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const audioMap: Record<string, any> = {
    Latin: require("@/assets/audio/Latin.mp3"),
    Greek: require("@/assets/audio/Greek.mp3"),
    French: require("@/assets/audio/French.mp3"),
    Spanish: require("@/assets/audio/Spanish.mp3"),
    German: require("@/assets/audio/German.mp3"),
    Italian: require("@/assets/audio/Italian.mp3"),
    Portuguese_Brazil: require("@/assets/audio/Portuguese_Brazil.mp3"),
    Dutch: require("@/assets/audio/Dutch.mp3"),
    Russian: require("@/assets/audio/Russian.mp3"),
    Japanese: require("@/assets/audio/Japanese.mp3"),
    Korean_Hangul: require("@/assets/audio/Korean_Hangul.mp3"),
    Arabic: require("@/assets/audio/Arabic.mp3"),
    Hebrew: require("@/assets/audio/Hebrew.mp3"),
    Hebrew_AS: require("@/assets/audio/Hebrew_AS.mp3"),
    English: require("@/assets/audio/English.mp3"),
    Latin_2: require("@/assets/audio/Latin_2.mp3"),
    Pig_Latin: require("@/assets/audio/Pig_Latin.mp3"),
    Greek_Koine: require("@/assets/audio/Greek_Koine.mp3"),
    Hebrew_Biblical: require("@/assets/audio/Hebrew_Biblical.mp3"),
    Aramaic_Syriac: require("@/assets/audio/Aramaic_Syriac.mp3"),
    Spanish_2: require("@/assets/audio/Spanish_2.mp3"),
    French_2: require("@/assets/audio/French_2.mp3"),
    German_2: require("@/assets/audio/German_2.mp3"),
    Italian_2: require("@/assets/audio/Italian_2.mp3"),
    Portuguese: require("@/assets/audio/Portuguese.mp3"),
    Dutch_2: require("@/assets/audio/Dutch_2.mp3"),
    Russian_2: require("@/assets/audio/Russian_2.mp3"),
    Arabic_2: require("@/assets/audio/Arabic_2.mp3"),
    Japanese_2: require("@/assets/audio/Japanese_2.mp3"),
    Korean: require("@/assets/audio/Korean.mp3"),
    Chinese_Mandarin: require("@/assets/audio/Chinese_Mandarin.mp3"),
    Sanskrit: require("@/assets/audio/Sanskrit.mp3"),
    Old_Norse: require("@/assets/audio/Old_Norse.mp3"),
    Coptic: require("@/assets/audio/Coptic.mp3"),
    Hexadecimal: require("@/assets/audio/Hexadecimal.mp3"),
  };


  // Build queue with random voice per translation
  const buildQueue = (): { language: string }[] => {
    return shuffleArray(
      Object.keys(audioMap).map((language) => ({ language }))
    );
  };

  const playFile = async (language: string) => {
    try {
      setIsLoading(true);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const source = audioMap[language];
      if (!source) {
        throw new Error(`No audio file found for language: ${language}`);
      }

      const { sound } = await Audio.Sound.createAsync(source);
      soundRef.current = sound;

      await sound.playAsync();
      setIsLoading(false);

      return new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) resolve();
        });
      });
    } catch (err) {
      console.error("Error playing file:", language, err);
      setIsLoading(false);
    }
  };

  const loopPlay = async () => {
    while (!stoppedRef.current && Object.keys(audioMap).length) {
      if (!queueRef.current.length || indexRef.current >= queueRef.current.length) {
        queueRef.current = buildQueue();
        indexRef.current = 0;
      }

      const current = queueRef.current[indexRef.current];
      indexRef.current += 1;

      await playFile(current.language);

      // small pause between prayers
      await new Promise((r) => setTimeout(r, 1000));
    }
  };

  const startLoop = async () => {
    if (!isLooping && audioMap.size) {
      stoppedRef.current = false;
      setIsLooping(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      queueRef.current = buildQueue();
      indexRef.current = 0;
      loopPlay();
    }
  };

  const stopLoop = () => {
    stoppedRef.current = true;
    setIsLooping(false);
    if (soundRef.current) soundRef.current.stopAsync();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.container}>
          <Text style={styles.h1}>Binding Prayers</Text>
          <Text>A binding prayer is a spiritual practice used for protection and deliverance from evil spirits and demonic influences, often invoking the authority of Jesus Christ.
    It is primarily intended for the laity as a prayer of spiritual protection against attacks from evil spirits.
    The prayer typically involves asking Jesus to bind evil spirits, demonic forces, and satanic powers in various realms—air, water, ground, fire, and underground—by His Precious Blood.
    The proper form for a laity's binding prayer is to ask Jesus to bind the spirits rather than command them to depart.</Text>
          <Image
            source={require("@/assets/images/prayers.jpg")}
            style={{ width: 375, height: 500 }}
            resizeMode="center"
          />
          {isLoading && <ActivityIndicator size="large" />}
          <Button title="Start Prayers" onPress={startLoop} disabled={isLooping} />
          <Button title="Stop" onPress={stopLoop} disabled={!isLooping} />
          <Text>&copy; Christ Kingdom</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, flex: 2},
  h1: {fontSize: 48, paddingTop: 15, paddingBottom: 35, flex: 1, fontWeight: "bold"}
});

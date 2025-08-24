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
  const [audioSetupComplete, setAudioSetupComplete] = useState(false);

  const queueRef = useRef<{ language: string }[]>([]);
  const indexRef = useRef(0);
  const stoppedRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const audioMap: Record<string, any> = {
    Latin: require("@/assets/audio/latin.mp3"),
    Greek: require("@/assets/audio/greek.mp3"),
    French: require("@/assets/audio/french.mp3"),
    Spanish: require("@/assets/audio/spanish.mp3"),
    German: require("@/assets/audio/german.mp3"),
    Italian: require("@/assets/audio/italian.mp3"),
    Portuguese_Brazil: require("@/assets/audio/portuguese_brazil.mp3"),
    Dutch: require("@/assets/audio/dutch.mp3"),
    Russian: require("@/assets/audio/russian.mp3"),
    Japanese: require("@/assets/audio/japanese.mp3"),
    Korean_Hangul: require("@/assets/audio/korean_hangul.mp3"),
    Arabic: require("@/assets/audio/arabic.mp3"),
    Hebrew: require("@/assets/audio/hebrew.mp3"),
    Hebrew_AS: require("@/assets/audio/hebrew_as.mp3"),
    English: require("@/assets/audio/english.mp3"),
    Latin_2: require("@/assets/audio/latin_2.mp3"),
    Pig_Latin: require("@/assets/audio/pig_latin.mp3"),
    Greek_Koine: require("@/assets/audio/greek_koine.mp3"),
    Hebrew_Biblical: require("@/assets/audio/hebrew_biblical.mp3"),
    Aramaic_Syriac: require("@/assets/audio/aramaic_syriac.mp3"),
    Spanish_2: require("@/assets/audio/spanish_2.mp3"),
    French_2: require("@/assets/audio/french_2.mp3"),
    German_2: require("@/assets/audio/german_2.mp3"),
    Italian_2: require("@/assets/audio/italian_2.mp3"),
    Portuguese: require("@/assets/audio/portuguese.mp3"),
    Dutch_2: require("@/assets/audio/dutch_2.mp3"),
    Russian_2: require("@/assets/audio/russian_2.mp3"),
    Arabic_2: require("@/assets/audio/arabic_2.mp3"),
    Japanese_2: require("@/assets/audio/japanese_2.mp3"),
    Korean: require("@/assets/audio/korean.mp3"),
    Chinese_Mandarin: require("@/assets/audio/chinese_mandarin.mp3"),
    Sanskrit: require("@/assets/audio/sanskrit.mp3"),
    Old_Norse: require("@/assets/audio/old_norse.mp3"),
    Coptic: require("@/assets/audio/coptic.mp3"),
    Hexadecimal: require("@/assets/audio/hexadecimal.mp3"),
  };

  // Setup audio mode on component mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        console.log("Setting up audio mode...");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("Audio mode setup complete");
        setAudioSetupComplete(true);
      } catch (error) {
        console.error("Error setting up audio mode:", error);
      }
    };
    
    setupAudio();
  }, []);

  // Build queue with random voice per translation
  const buildQueue = (): { language: string }[] => {
    return shuffleArray(
      Object.keys(audioMap).map((language) => ({ language }))
    );
  };

  const playFile = async (language: string) => {
    try {
      console.log(`Attempting to play: ${language}`);
      setIsLoading(true);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const source = audioMap[language];
      if (!source) {
        throw new Error(`No audio file found for language: ${language}`);
      }

      console.log(`Loading audio for: ${language}`);
      const { sound } = await Audio.Sound.createAsync(source, {
        shouldPlay: false,
        isLooping: false,
        progressUpdateIntervalMillis: 1000,
        positionMillis: 0,
      });
      soundRef.current = sound;

      console.log(`Playing audio for: ${language}`);
      await sound.playAsync();
      setIsLoading(false);

      return new Promise<void>((resolve, reject) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          
          // if (status.error) {
          //   console.error(`Playback error for ${language}:`, status.error);
          //   reject(new Error(status.error));
          //   return;
          // }
          
          if (status.didJustFinish) {
            console.log(`Finished playing: ${language}`);
            resolve();
          }
        });
      });
    } catch (err) {
      console.error("Error playing file:", language, err);
      setIsLoading(false);
      throw err;
    }
  };

  const loopPlay = async () => {
    try {
      while (!stoppedRef.current && Object.keys(audioMap).length > 0) {
        if (!queueRef.current.length || indexRef.current >= queueRef.current.length) {
          console.log("Building new queue...");
          queueRef.current = buildQueue();
          indexRef.current = 0;
        }

        const current = queueRef.current[indexRef.current];
        indexRef.current += 1;

        if (!stoppedRef.current) {
          await playFile(current.language);
        }

        // Small pause between prayers
        if (!stoppedRef.current) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    } catch (error) {
      console.error("Error in loop play:", error);
      setIsLooping(false);
      stoppedRef.current = true;
    }
  };

  const startLoop = async () => {
    if (!audioSetupComplete) {
      console.log("Audio setup not complete yet, please wait...");
      return;
    }

    if (!isLooping && Object.keys(audioMap).length > 0) {
      console.log("Starting prayer loop...");
      stoppedRef.current = false;
      setIsLooping(true);

      queueRef.current = buildQueue();
      indexRef.current = 0;
      
      try {
        await loopPlay();
      } catch (error) {
        console.error("Error starting loop:", error);
        setIsLooping(false);
        stoppedRef.current = true;
      }
    }
  };

  const stopLoop = async () => {
    console.log("Stopping prayer loop...");
    stoppedRef.current = true;
    setIsLooping(false);
    
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("Cleaning up audio resources...");
      stoppedRef.current = true;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.container}>
          <Text style={styles.h1}>Binding Prayers</Text>
          <Text style={styles.description}>
            A binding prayer is a spiritual practice used for protection and deliverance from evil spirits and demonic influences, often invoking the authority of Jesus Christ.
            It is primarily intended for the laity as a prayer of spiritual protection against attacks from evil spirits.
            The prayer typically involves asking Jesus to bind evil spirits, demonic forces, and satanic powers in various realms—air, water, ground, fire, and underground—by His Precious Blood.
            The proper form for a laity's binding prayer is to ask Jesus to bind the spirits rather than command them to depart.
          </Text>
          
          <Image
            source={require("@/assets/images/prayers.jpg")}
            style={styles.image}
            resizeMode="center"
          />
          
          {!audioSetupComplete && (
            <Text style={styles.setupText}>Setting up audio...</Text>
          )}
          
          {isLoading && (
            <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
          )}
          
          <Button 
            title="Start Prayers" 
            onPress={startLoop} 
            disabled={isLooping || !audioSetupComplete} 
          />
          
          <Button 
            title="Stop" 
            onPress={stopLoop} 
            disabled={!isLooping} 
          />
          
          <Text style={styles.copyright}>&copy; Christ Kingdom</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingTop: 10, 
    paddingBottom: 15, 
    paddingLeft: 10, 
    paddingRight: 10, 
    flex: 1
  },
  h1: {
    fontSize: 48, 
    paddingTop: 15, 
    paddingBottom: 35, 
    fontWeight: "bold"
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'justify'
  },
  image: {
    width: 375,
    height: 500,
    alignSelf: 'center',
    marginVertical: 20
  },
  setupText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginVertical: 10
  },
  loader: {
    marginVertical: 20
  },
  copyright: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#666'
  }
});
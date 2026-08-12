# Calendarium Occultum — build APK Android firmato (Rocky Linux + yum)

L'app è una web app (TanStack Start). Per l'APK si impacchetta con **Capacitor**.

## 1. Dipendenze sul VPS Rocky Linux

```bash
sudo yum install -y java-17-openjdk-devel unzip wget git
curl -fsSL https://bun.sh/install | bash        # oppure: sudo yum install -y nodejs
```

Android SDK command-line tools:

```bash
sudo mkdir -p /opt/android-sdk && sudo chown -R $USER /opt/android-sdk
cd /opt/android-sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-*.zip -d cmdline-tools
mkdir -p cmdline-tools/latest && mv cmdline-tools/cmdline-tools/* cmdline-tools/latest/

cat >> ~/.bashrc <<'EOF'
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
EOF
source ~/.bashrc

yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

## 2. Progetto

```bash
git clone <url-del-progetto> calendarium && cd calendarium
bun install
bun add @capacitor/core @capacitor/android
bun add -d @capacitor/cli
```

Build statica dei file web (SPA):

```bash
bun run build
```

Crea `capacitor.config.json` nella root:

```json
{
  "appId": "app.occultum.calendarium",
  "appName": "Calendarium Occultum",
  "webDir": "dist/client",
  "server": { "androidScheme": "https" }
}
```

> Se `dist/client` non esiste dopo la build, controlla la cartella prodotta
> (`ls dist`) e metti quella in `webDir`.

```bash
bunx cap add android
bunx cap sync android
```

## 3. Permessi Android

In `android/app/src/main/AndroidManifest.xml`, dentro `<manifest>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

L'app richiede posizione, notifiche e audio all'onboarding, alla prima apertura.

## 4. Keystore di firma

```bash
keytool -genkey -v -keystore ~/occultum.keystore -alias occultum \
  -keyalg RSA -keysize 2048 -validity 10000
```

Conserva password e file: senza non potrai più aggiornare l'app.

Crea `android/keystore.properties` (NON committarlo):

```properties
storeFile=/home/<utente>/occultum.keystore
storePassword=LA_TUA_PASSWORD
keyAlias=occultum
keyPassword=LA_TUA_PASSWORD
```

In `android/app/build.gradle`, prima di `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file("keystore.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

e dentro `android { ... }`:

```gradle
signingConfigs {
    release {
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

## 5. Build dell'APK firmato

```bash
cd android
./gradlew assembleRelease
```

APK firmato:

```
android/app/build/outputs/apk/release/app-release.apk
```

Per il Play Store usa invece l'AAB:

```bash
./gradlew bundleRelease   # android/app/build/outputs/bundle/release/app-release.aab
```

Verifica la firma:

```bash
$ANDROID_HOME/build-tools/34.0.0/apksigner verify --print-certs \
  app/build/outputs/apk/release/app-release.apk
```

## 6. Aggiornamenti

Dopo ogni modifica al codice web:

```bash
bun run build && bunx cap sync android && cd android && ./gradlew assembleRelease
```

## Note

- Tutti i dati (diario, umore, task, profilo, preferiti radio) restano in
  locale sul dispositivo; il backup JSON si esporta dalle Impostazioni.
- Meteo: Open-Meteo (nessuna chiave). Radio: Radio Browser (nessuna chiave).
  Servono connessione internet.
- Se Gradle va in OOM sul VPS: `echo "org.gradle.jvmargs=-Xmx2g" >> android/gradle.properties`.

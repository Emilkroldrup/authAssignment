# Projektoversigt: Avanceret REST API til brugerhåndtering

## Introduktion

Hej med dig! Dette er mit Advanced REST API-projekt, der er bygget til at håndtere brugere, roller og authentication sikkert. jeg vil gerne tage dig igennem de vigtigste funktioner, de beslutninger jeg har truffet, og de udfordringer jeg har tacklet undervejs. Målet har været at bygge en skalerbar, veldokumenteret og sikker API.

## Projektfunktioner

- **Brugerregistrering og authentication**: Brugere kan registrere sig med forskellige roller og logge ind sikkert.
- **Rollebaseret adgangskontrol**: Hver bruger tildeles en rolle (`soldat`, `officer`, `admin`), som dikterer deres adgangsniveau i appen.
- **JWT-authentication**: Jeg startede med en simpel JWT-implementering ved hjælp af `jsonwebtoken`-biblioteket, men besluttede mig senere for at tage udfordringen op med at lave mine egne JWT-funktioner. Dette gjorde jeg for virkelig at forstå, hvordan JWT fungerer bag kulisserne.
- **API-dokumentation med Swagger**: Fuldt dokumenteret med Swagger for nem integration.
- **Frontend-integration**: Backend-API'et er klar til at blive koblet sammen med en Next.js frontend, som jeg allerede har startet på.

## Oversigt over mappe-struktur

For at holde det hele modulært og let at vedligeholde, har jeg organiseret backenden i flere mapper:

- **`backend/src/config`**: Håndterer databasekonfiguration og forbindelsesoplysninger.
- **`backend/src/controllers`**: Styrer brugerrelaterede handlinger som registrering, login og rollehåndtering.
- **`backend/src/middleware`**: Indeholder middleware til JWT og rollevalidering.
- **`backend/src/models`**: Mongoose-modeller til MongoDB.
- **`backend/src/routes`**: Definerer alle endpoints relateret til authentication.

Jeg har også oprettet en **frontend**-mappe til Next.js TypeScript-applikationen, så det er nemt at navigere mellem backend og frontend-arbejdet.

## Nøgleændringer og udfordringer i arkitekturen

### 1. Håndtering af JWT-tokens

Oprindeligt brugte jeg `jsonwebtoken`-biblioteket til at generere og verificere tokens. Det fungerede fint, men jeg ville gerne tage det et skridt videre og virkelig lære, hvordan JWT fungerer. Så jeg udfordrede mig selv ved at bygge token-generering og verifikation fra bunden.

Nu opretter og signerer jeg manuelt tokens, håndterer kodning, og verificerer deres integritet, hvilket har givet mig en meget dybere forståelse af JWT, hashing og payload-sikkerhed.

### 2. Adskillelse af JWT-logik

Efter jeg begyndte at oprette og verificere tokens manuelt, besluttede jeg at udtrække JWT-relateret funktionalitet til en dedikeret utility-fil (`jwtUtils.js`). Dette gør authenticationscontrolleren (`authController`) renere og lettere at vedligeholde:

- **`generateJWT`**: Opretter tokens manuelt, inkluderer udløbstid og signerer dem sikkert.
- **`verifyJWT`**: Verificerer tokens manuelt, kontrollerer for manipulation og udløbstid.

### 3. Forbedringer i Middleware

Jeg opdaterede også **authenticationsmiddleware** til at bruge min tilpassede `verifyJWT`-funktion, så der er konsistens i hele applikationen. Derefter tilføjede jeg en **rollebaseret middleware** (`roleMiddleware`) for at begrænse visse ruter til specifikke brugerroller, fx kun til admin.

### 4. Rollebaseret adgangskontrol

Projektet har nu en klar struktur, der definerer, hvilke roller der har adgang til hvad. For eksempel kræver `/api/auth/admin`-ruten, at brugeren ikke kun er autentificeret, men også har rollen `admin`.

## Gennemgang af backend-funktioner

- **Registrering**: Brugere kan registrere sig via `/api/auth/register`-endpointet. Jeg brugte **Joi** til validering for at sikre stærke adgangskoder og krav til brugernavne.
- **Login**: `/api/auth/login`-endpointet giver brugere mulighed for at logge ind. Hvis legitimationsoplysningerne er korrekte, genereres en JWT-token og sendes som en **HTTP-only cookie** for ekstra sikkerhed.
- **JWT-verifikation**: Beskyttede ruter er sikret med JWT-verifikation via `authMiddleware`, som sikrer, at token er gyldig og ikke er udløbet.
- **Rolle-middleware**: Nogle ruter kræver ekstra kontrol—som fx admin-only `/api/auth/admin`-ruten, der bruger `roleMiddleware` til at verificere brugerens rolle.

## Frontend-integration

Jeg har sat en **Next.js** frontend op i **TypeScript**, der bruger backend-API'et. Den inkluderer formularer til **brugerregistrering** og **login**, og bruger **Axios** til at kommunikere med backenden. JWT-tokens er sat som **HTTP-only cookies** for at forbedre sikkerheden og forhindre XSS-angreb. Jeg planlægger at bruge **React Context** til at håndtere authenticationstilstanden, så brugere nemt kan blive omdirigeret baseret på deres roller.

## Fremtidige forbedringer

- **Frontend-beskyttede ruter**: Jeg vil implementere beskyttede ruter ved hjælp af Next.js for at sikre, at kun brugere med de rette roller kan få adgang til visse sider.
- **Sessionshåndtering**: Tilføjelse af en refresh token-mekanisme for at forlænge brugerens session sikkert er også på min liste.
- **UI/UX-forbedringer**: Jeg vil gøre frontenden virkelig lækker, med bedre styling og brugervenlige fejlmeddelelser.

## Konklusion

Dette projekt har handlet om at bygge en komplet backend-opsætning til **sikker brugerhåndtering** med **rollebaseret adgangskontrol** og **JWT-authentication**. At gå fra at bruge et bibliotek til JWT til at bygge min egen implementering var en udfordrende men lærerig oplevelse. Ved at udtrække JWT-operationer, bruge middleware til adgangskontrol og strukturere applikationen i logiske moduler, har jeg skabt noget, der ikke kun er funktionelt, men også vedligeholdelsesvenligt og skalerbart.

Tak fordi du kiggede forbi mit projekt! Hvis du har spørgsmål eller forslag til forbedringer, vil jeg meget gerne høre dem.

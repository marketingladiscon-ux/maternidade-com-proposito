# Assets Management - Imagens do Projeto

## Status Atual
As imagens estão sendo carregadas de links externos (Google Drive via lh3.googleusercontent.com). O código foi **preparado para usar paths locais** na pasta `/public`.

## Imagens Necessárias

Faça upload das seguintes imagens para a pasta `/public`:

### 1. Logo Principal
- **Destino**: `/public/logo.png` (ou `.jpg`, `.svg`)
- **Google ID**: `1lPbdKYASJpvvSoWq0jsuCCIOotF6FiAa`
- **Uso**: Homepage, backgrounds
- **Valor esperado em App.tsx**: `"/logo.png"`

### 2. Logo Branca
- **Destino**: `/public/logo-white.png` (ou `.jpg`, `.svg`)
- **Google ID**: `1t8qAj0MkyynCrs5lxmnEk7OB2rPrG-tc`
- **Uso**: Overlay em backgrounds escuros
- **Valor esperado em App.tsx**: `"/logo-white.png"`

### 3. Logo com Texto (completo)
- **Destino**: `/public/logo-text.png` (ou `.jpg`, `.svg`)
- **Google ID**: `1vCAD1c5fwycHPGNhuNtOaQiIFQ5v_lMi`
- **Uso**: Navigation bar, header
- **Valor esperado em App.tsx**: `"/logo-text.png"`

### 4. Logo - Apenas Texto
- **Destino**: `/public/logo-text-only.png` (ou `.jpg`, `.svg`)
- **Google ID**: `1eIGKF8RosYrR0NAiCFs5rkvHmuexSkHA`
- **Uso**: Fallback quando logo icon não está disponível
- **Valor esperado em App.tsx**: `"/logo-text-only.png"`

### 5. Foto da Sonja (fundadora)
- **Destino**: `/public/sonja-photo.png` (ou `.jpg`)
- **Google ID**: `1a-HFeGkgBDyUCAty8tIJSoUvIv4CkBVv`
- **Uso**: Seção "Sobre a Mentoria" do Sales page
- **Valor esperado em App.tsx**: `"/sonja-photo.png"`

## Passos para Upload

1. **Baixe as imagens** do Google Drive (use os IDs acima)
2. **Converta para formato web** se necessário (recomendado PNG ou JPG para performance)
3. **Faça upload para `/public`** no repositório local:
   ```
   z:\CRIARR\_CRIARR\_SONJA CHACON\_2026\MATERINIDADE COM PROPOSITO\PAGINA DE CAPTURA\maternidade-com-propósito_v2\public\
   ```
4. **Commit e push** para GitHub:
   ```bash
   git add public/
   git commit -m "Add local asset images"
   git push origin main
   ```

## Verificação

Após fazer upload das imagens:

```bash
# Verificar se as imagens estão presentes
ls public/

# Deve listar:
# logo.png (ou .jpg, .svg)
# logo-white.png
# logo-text.png
# logo-text-only.png
# sonja-photo.png (ou .jpg)
```

## Código Já Preparado ✅

O arquivo `src/App.tsx` foi atualizado com os seguintes paths:

```typescript
const LOGO_URL = "/logo.png";
const LOGO_WHITE_URL = "/logo-white.png";
const LOGO_TEXT_URL = "/logo-text.png";
const LOGO_TEXT_ONLY_URL = "/logo-text-only.png";
const SONJA_PHOTO = "/sonja-photo.png";
```

Também foi atualizado `index.html` para:
```html
<link rel="icon" href="/logo.png" type="image/png" />
<link rel="shortcut icon" href="/logo.png" type="image/png" />
<meta property="og:image" content="/logo.png" />
<meta property="twitter:image" content="/logo.png" />
```

## Performance & Vantagens

✅ Carregamento mais rápido (imagens locais vs Google Drive)  
✅ Sem dependência de URLs externas  
✅ Melhor SEO  
✅ Deploy mais rápido e confiável (Vercel)  
✅ Controle total das imagens  

## Troubleshooting

**Imagens não aparecem após upload?**
1. Verifique os nomes dos arquivos (case-sensitive)
2. Rode `npm run build` para rebuild local
3. Força refresh: `Ctrl+Shift+R` (Chrome) ou `Cmd+Shift+R` (Mac)
4. Verifique console (F12) para erros 404

**Formato recomendado:**
- Logos: PNG com transparência (melhor qualidade)
- Fotos: JPG (melhor compressão)
- SVG também funciona perfeitamente

---

**Status**: ⏳ Aguardando upload das imagens para `/public`  
**Próximo passo**: Fazer upload dos arquivos e fazer commit ao GitHub

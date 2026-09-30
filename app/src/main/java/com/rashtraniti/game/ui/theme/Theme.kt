package com.rashtraniti.game.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val SaffronPrimary = Color(0xFFFF9933)
val IndiaGreen = Color(0xFF138808)
val DeepNavy = Color(0xFF0F172A)
val AshokaBlue = Color(0xFF000080)
val DarkBackground = Color(0xFF090D16)
val DarkSurface = Color(0xFF161E2E)
val CardBackground = Color(0xFF1E293B)
val GoldAccent = Color(0xFFF59E0B)
val AccentRed = Color(0xFFEF4444)
val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = SaffronPrimary,
    secondary = IndiaGreen,
    tertiary = GoldAccent,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = Color.Black,
    onSecondary = Color.White,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun RashtraNitiTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}

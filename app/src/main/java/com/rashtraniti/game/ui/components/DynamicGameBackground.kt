package com.rashtraniti.game.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import com.rashtraniti.game.data.model.PoliticalLevel
import com.rashtraniti.game.ui.theme.*
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

enum class BackgroundMode {
    HOME,
    MAP,
    ELECTION,
    CAMPAIGN,
    MEDIA,
    CRISIS_FLOOD,
    CRISIS_DROUGHT,
    CRISIS_CYCLONE,
    CRISIS_ECONOMY,
    CRISIS_POLITICAL,
    PRIME_MINISTER,
    SUCCESS_CELEBRATION,
    DISASTER_RESPONSE
}

private data class Particle(
    var x: Float,
    var y: Float,
    var speedY: Float,
    var speedX: Float,
    var radius: Float,
    var alpha: Float,
    val color: Color
)

@Composable
fun DynamicGameBackground(
    mode: BackgroundMode = BackgroundMode.HOME,
    reducedMotion: Boolean = false,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "BackgroundLoop")

    // Slow ambient rotation for Chakra / subtle ambient lights
    val slowRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = if (reducedMotion) 0f else 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(40000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "SlowRotation"
    )

    // Pulse value for glowing boundaries, crisis radars and elections
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.35f,
        targetValue = 0.85f,
        animationSpec = infiniteRepeatable(
            animation = tween(if (reducedMotion) 1000 else 1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PulseAlpha"
    )

    // Cyclone vortex rotation
    val cycloneRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = if (reducedMotion) 0f else 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "CycloneRotation"
    )

    // Wave offset for Flood & Economy graphs
    val waveOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = if (reducedMotion) 0f else (2 * PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "WaveOffset"
    )

    // Floating particles pool
    val particles = remember {
        List(24) {
            Particle(
                x = (Math.random() * 1000).toFloat(),
                y = (Math.random() * 1800).toFloat(),
                speedY = (0.4f + Math.random() * 0.8f).toFloat(),
                speedX = (-0.3f + Math.random() * 0.6f).toFloat(),
                radius = (2f + Math.random() * 4f).toFloat(),
                alpha = (0.2f + Math.random() * 0.5f).toFloat(),
                color = when ((Math.random() * 3).toInt()) {
                    0 -> SaffronPrimary
                    1 -> IndiaGreen
                    else -> GoldAccent
                }
            )
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height
            val center = Offset(width / 2f, height / 2f)

            // 1. Base Gradient depending on mode
            val bgBrush = when (mode) {
                BackgroundMode.CRISIS_FLOOD -> Brush.verticalGradient(listOf(Color(0xFF031526), Color(0xFF06203D), Color(0xFF020B14)))
                BackgroundMode.CRISIS_DROUGHT -> Brush.verticalGradient(listOf(Color(0xFF261204), Color(0xFF381A05), Color(0xFF0F0702)))
                BackgroundMode.CRISIS_CYCLONE -> Brush.verticalGradient(listOf(Color(0xFF0B1926), Color(0xFF132B3E), Color(0xFF060E17)))
                BackgroundMode.CRISIS_ECONOMY -> Brush.verticalGradient(listOf(Color(0xFF2E0808), Color(0xFF1F0505), Color(0xFF0A0202)))
                BackgroundMode.PRIME_MINISTER -> Brush.verticalGradient(listOf(Color(0xFF0D1527), Color(0xFF111D36), Color(0xFF070B14)))
                BackgroundMode.SUCCESS_CELEBRATION -> Brush.verticalGradient(listOf(Color(0xFF1A1A05), Color(0xFF2E2405), Color(0xFF0A0B02)))
                else -> Brush.verticalGradient(listOf(DarkBackground, DarkSurface, Color(0xFF060910)))
            }
            drawRect(brush = bgBrush)

            // 2. Mode-Specific Visual Layers
            when (mode) {
                BackgroundMode.HOME -> {
                    // Subtle Chakra / India outline in the background
                    rotate(slowRotation, pivot = center) {
                        drawCircle(
                            color = SaffronPrimary.copy(alpha = 0.04f * pulseAlpha),
                            radius = width * 0.55f,
                            center = center,
                            style = Stroke(width = 3f)
                        )
                        // Chakra Spokes
                        for (i in 0 until 24) {
                            val angle = (i * 15 * PI / 180).toFloat()
                            val end = Offset(center.x + cos(angle) * (width * 0.55f), center.y + sin(angle) * (width * 0.55f))
                            drawLine(
                                color = SaffronPrimary.copy(alpha = 0.03f),
                                start = center,
                                end = end,
                                strokeWidth = 1.5f
                            )
                        }
                    }

                    // Soft ambient grid lines
                    drawAmbientGrid(width, height, Color(0xFF1E293B).copy(alpha = 0.35f))
                    drawFloatingParticles(particles, width, height, reducedMotion)
                }

                BackgroundMode.MAP -> {
                    drawAmbientGrid(width, height, Color(0xFF1E293B).copy(alpha = 0.5f))
                    // Pulsing player constituency radar sweep
                    drawCircle(
                        color = SaffronPrimary.copy(alpha = 0.15f * pulseAlpha),
                        radius = 80f * pulseAlpha,
                        center = center
                    )
                    drawCircle(
                        color = IndiaGreen.copy(alpha = 0.35f),
                        radius = 12f,
                        center = center
                    )
                }

                BackgroundMode.ELECTION -> {
                    // Gentle electoral waving flag lines & ballot pulse
                    for (i in 0 until 5) {
                        val yPos = height * 0.2f + (i * 120f)
                        drawWaveLine(width, yPos, waveOffset + i, SaffronPrimary.copy(alpha = 0.07f))
                    }
                    drawCircle(
                        color = GoldAccent.copy(alpha = 0.08f * pulseAlpha),
                        radius = width * 0.45f,
                        center = center,
                        style = Stroke(width = 4f)
                    )
                    drawFloatingParticles(particles, width, height, reducedMotion)
                }

                BackgroundMode.CAMPAIGN -> {
                    // Moving campaign particle trails & rally spotlight cones
                    drawSpotlight(center, width, height, SaffronPrimary.copy(alpha = 0.06f * pulseAlpha))
                    drawFloatingParticles(particles, width, height, reducedMotion)
                }

                BackgroundMode.MEDIA -> {
                    // Horizontal ticker lines & camera flash bursts
                    drawLine(
                        color = SaffronPrimary.copy(alpha = 0.15f * pulseAlpha),
                        start = Offset(0f, height * 0.12f),
                        end = Offset(width, height * 0.12f),
                        strokeWidth = 2f
                    )
                    drawLine(
                        color = GoldAccent.copy(alpha = 0.12f * pulseAlpha),
                        start = Offset(0f, height * 0.88f),
                        end = Offset(width, height * 0.88f),
                        strokeWidth = 2f
                    )
                }

                BackgroundMode.CRISIS_FLOOD -> {
                    // Subtle non-graphic river/water ripples & radar highlight
                    for (i in 0 until 4) {
                        val yPos = height * 0.6f + (i * 70f)
                        drawWaveLine(width, yPos, waveOffset * 1.5f + i, Color(0xFF38BDF8).copy(alpha = 0.12f))
                    }
                    drawCircle(
                        color = Color(0xFF38BDF8).copy(alpha = 0.18f * pulseAlpha),
                        radius = 120f * pulseAlpha,
                        center = Offset(width * 0.65f, height * 0.45f)
                    )
                }

                BackgroundMode.CRISIS_CYCLONE -> {
                    // Rotating weather pattern vortex in eastern coastal zone
                    rotate(cycloneRotation, pivot = Offset(width * 0.7f, height * 0.55f)) {
                        for (r in 1..4) {
                            drawCircle(
                                color = Color(0xFF94A3B8).copy(alpha = 0.10f),
                                radius = r * 35f,
                                center = Offset(width * 0.7f, height * 0.55f),
                                style = Stroke(width = 2f)
                            )
                        }
                    }
                }

                BackgroundMode.CRISIS_ECONOMY -> {
                    // Financial trend graph wave with warning pulse
                    drawWaveLine(width, height * 0.5f, waveOffset, AccentRed.copy(alpha = 0.20f * pulseAlpha))
                }

                BackgroundMode.PRIME_MINISTER -> {
                    // Subtle Parliament Dome curves & national development matrix
                    drawParliamentSilhouette(width, height, center)
                    drawAmbientGrid(width, height, Color(0xFF1E293B).copy(alpha = 0.4f))
                    drawWaveLine(width, height * 0.75f, waveOffset * 0.5f, GoldAccent.copy(alpha = 0.08f))
                }

                BackgroundMode.SUCCESS_CELEBRATION -> {
                    // Radiant celebratory golden aura and upward sparkles
                    drawCircle(
                        brush = Brush.radialGradient(
                            listOf(GoldAccent.copy(alpha = 0.20f * pulseAlpha), Color.Transparent),
                            center = center,
                            radius = width * 0.7f
                        ),
                        radius = width * 0.7f,
                        center = center
                    )
                    drawFloatingParticles(particles, width, height, reducedMotion)
                }

                else -> {
                    drawAmbientGrid(width, height, Color(0xFF1E293B).copy(alpha = 0.35f))
                }
            }
        }

        // Render foreground game UI on top
        content()
    }
}

private fun DrawScope.drawAmbientGrid(width: Float, height: Float, color: Color) {
    val step = 45f
    var x = 0f
    while (x <= width) {
        drawLine(color = color, start = Offset(x, 0f), end = Offset(x, height), strokeWidth = 1f)
        x += step
    }
    var y = 0f
    while (y <= height) {
        drawLine(color = color, start = Offset(0f, y), end = Offset(width, y), strokeWidth = 1f)
        y += step
    }
}

private fun DrawScope.drawWaveLine(width: Float, yBase: Float, offset: Float, color: Color) {
    val path = Path()
    path.moveTo(0f, yBase)
    val step = 20f
    var x = 0f
    while (x <= width) {
        val y = yBase + sin(x * 0.015f + offset) * 14f
        path.lineTo(x, y)
        x += step
    }
    drawPath(path = path, color = color, style = Stroke(width = 2f))
}

private fun DrawScope.drawSpotlight(center: Offset, width: Float, height: Float, color: Color) {
    val path = Path()
    path.moveTo(width * 0.2f, height)
    path.lineTo(width * 0.45f, 0f)
    path.lineTo(width * 0.55f, 0f)
    path.lineTo(width * 0.8f, height)
    path.close()
    drawPath(path = path, color = color)
}

private fun DrawScope.drawParliamentSilhouette(width: Float, height: Float, center: Offset) {
    val domeWidth = width * 0.5f
    val domeHeight = 90f
    val domeBaseY = height * 0.35f

    // Soft architectural arches
    drawArc(
        color = SaffronPrimary.copy(alpha = 0.05f),
        startAngle = 180f,
        sweepAngle = 180f,
        useCenter = true,
        topLeft = Offset(center.x - domeWidth / 2f, domeBaseY - domeHeight),
        size = androidx.compose.ui.geometry.Size(domeWidth, domeHeight * 2)
    )
}

private fun DrawScope.drawFloatingParticles(
    particles: List<Particle>,
    width: Float,
    height: Float,
    reducedMotion: Boolean
) {
    particles.forEach { p ->
        if (!reducedMotion) {
            p.y -= p.speedY
            p.x += p.speedX
            if (p.y < 0) {
                p.y = height
                p.x = (Math.random() * width).toFloat()
            }
            if (p.x < 0) p.x = width
            if (p.x > width) p.x = 0f
        }
        drawCircle(
            color = p.color.copy(alpha = p.alpha),
            radius = p.radius,
            center = Offset(p.x, p.y)
        )
    }
}

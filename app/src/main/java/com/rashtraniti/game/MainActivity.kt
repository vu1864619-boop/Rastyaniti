package com.rashtraniti.game

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import com.rashtraniti.game.ui.screens.RashtraNitiMainApp
import com.rashtraniti.game.ui.theme.RashtraNitiTheme
import com.rashtraniti.game.viewmodel.RashtraNitiViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: RashtraNitiViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RashtraNitiTheme {
                RashtraNitiMainApp(viewModel = viewModel)
            }
        }
    }
}

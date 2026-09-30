package com.rashtraniti.game

import android.app.Application
import com.rashtraniti.game.data.database.AppDatabase

class RashtraNitiApp : Application() {
    val database: AppDatabase by lazy { AppDatabase.getDatabase(this) }

    override fun onCreate() {
        super.onCreate()
    }
}

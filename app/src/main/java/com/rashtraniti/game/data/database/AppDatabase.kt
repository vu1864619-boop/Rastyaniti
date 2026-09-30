package com.rashtraniti.game.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.rashtraniti.game.data.dao.PartyDao
import com.rashtraniti.game.data.dao.PlayerDao
import com.rashtraniti.game.data.model.PlayerProfile
import com.rashtraniti.game.data.model.PoliticalParty

@Database(
    entities = [PlayerProfile::class, PoliticalParty::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun playerDao(): PlayerDao
    abstract fun partyDao(): PartyDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "rashtraniti_database.db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}

package com.rashtraniti.game.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.rashtraniti.game.data.model.PlayerProfile
import com.rashtraniti.game.data.model.PoliticalParty
import kotlinx.coroutines.flow.Flow

@Dao
interface PlayerDao {
    @Query("SELECT * FROM player_profile WHERE id = :id LIMIT 1")
    fun getPlayerProfileFlow(id: String = "player_main"): Flow<PlayerProfile?>

    @Query("SELECT * FROM player_profile WHERE id = :id LIMIT 1")
    suspend fun getPlayerProfile(id: String = "player_main"): PlayerProfile?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdatePlayer(player: PlayerProfile)

    @Update
    suspend fun updatePlayer(player: PlayerProfile)
}

@Dao
interface PartyDao {
    @Query("SELECT * FROM political_party WHERE id = :id LIMIT 1")
    fun getPartyFlow(id: String = "party_main"): Flow<PoliticalParty?>

    @Query("SELECT * FROM political_party WHERE id = :id LIMIT 1")
    suspend fun getParty(id: String = "party_main"): PoliticalParty?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateParty(party: PoliticalParty)

    @Update
    suspend fun updateParty(party: PoliticalParty)
}
